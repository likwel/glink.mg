import { Router } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.js";
import { requireAdmin } from "../../middleware/admin.js";

const router = Router();
const prisma  = new PrismaClient();
const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  PRO: {
    monthly: { ariary: 9900,   stripeId: process.env.STRIPE_PRO_MONTHLY_ID },
    yearly:  { ariary: 99000,  stripeId: process.env.STRIPE_PRO_YEARLY_ID  },
  },
  BUSINESS: {
    monthly: { ariary: 24900,  stripeId: process.env.STRIPE_BIZ_MONTHLY_ID },
    yearly:  { ariary: 249000, stripeId: process.env.STRIPE_BIZ_YEARLY_ID  },
  },
};

// ─── STRIPE : Checkout ────────────────────────────────────────────────────────
router.post("/stripe/checkout", requireAuth, async (req, res) => {
  try {
    const { plan, billing } = req.body;
    const user = req.user;

    if (!PLANS[plan]?.[billing])
      return res.status(400).json({ error: "Plan ou période invalide" });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const session = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       "subscription",
      line_items: [{ price: PLANS[plan][billing].stripeId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url:  `${process.env.FRONTEND_URL}/pricing?payment=cancelled`,
      metadata:    { userId: String(user.id), plan, billing },
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── STRIPE : Webhook ─────────────────────────────────────────────────────────
router.post("/stripe/webhook", async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return res.status(400).send("Signature invalide");
  }

  const obj = event.data.object;

  if (event.type === "checkout.session.completed") {
    const { userId, plan, billing } = obj.metadata;
    const sub = await stripe.subscriptions.retrieve(obj.subscription);

    await prisma.$transaction([
      prisma.user.update({ where: { id: Number(userId) }, data: { plan } }),
      prisma.subscription.create({
        data: {
          userId: Number(userId), plan, status: "active",
          stripeSubscriptionId: sub.id,
          currentPeriodStart:   new Date(sub.current_period_start * 1000),
          currentPeriodEnd:     new Date(sub.current_period_end   * 1000),
        },
      }),
      prisma.payment.create({
        data: {
          userId: Number(userId), plan, method: "STRIPE", status: "PAID",
          amount: PLANS[plan][billing].ariary,
          stripePaymentId: obj.payment_intent,
          billingPeriod: billing,
        },
      }),
    ]);
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: obj.id },
    });
    if (sub) {
      await prisma.user.update({ where: { id: sub.userId }, data: { plan: "FREE" } });
      await prisma.subscription.update({ where: { id: sub.id }, data: { status: "cancelled" } });
    }
  }

  res.json({ received: true });
});

// ─── MANUEL : Soumettre une preuve ───────────────────────────────────────────
router.post("/manual/submit", requireAuth, async (req, res) => {
  try {
    console.log("[manual/submit] body:", req.body);
    console.log("[manual/submit] user:", req.user?.id, req.user?.plan);

    const { plan, billing, proofUrl } = req.body;

    if (!plan || !billing)
      return res.status(400).json({ error: "Plan et période requis" });

    const planUpper = plan.toUpperCase();

    if (!PLANS[planUpper])
      return res.status(400).json({ error: `Plan inconnu : "${planUpper}". Valeurs acceptées : PRO, BUSINESS` });

    if (!PLANS[planUpper][billing])
      return res.status(400).json({ error: `Période invalide : "${billing}". Valeurs acceptées : monthly, yearly` });

    const payment = await prisma.payment.create({
      data: {
        userId:        req.user.id,
        plan:          planUpper,
        method:        "MANUAL",
        status:        "PENDING",
        amount:        PLANS[planUpper][billing].ariary,
        proofUrl:      proofUrl || null,
        billingPeriod: billing,
      },
    });

    res.json({ message: "Soumis, en attente de validation", payment });
  } catch (e) {
    console.error("[manual/submit] ERREUR:", e.message, e.stack);
    res.status(500).json({ error: e.message });
  }
});

// ─── ADMIN : Paiements en attente ────────────────────────────────────────────
router.get("/admin/pending", requireAdmin, async (req, res) => {
  const payments = await prisma.payment.findMany({
    where:   { method: "MANUAL", status: "PENDING" },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(payments);
});

// ─── ADMIN : Valider ─────────────────────────────────────────────────────────
router.post("/admin/validate/:id", requireAdmin, async (req, res) => {
  const payment = await prisma.payment.findUnique({ where: { id: Number(req.params.id) } });
  if (!payment || payment.status !== "PENDING")
    return res.status(404).json({ error: "Paiement introuvable ou déjà traité" });

  const now = new Date();
  const end = new Date(now);
  payment.billingPeriod === "yearly"
    ? end.setFullYear(end.getFullYear() + 1)
    : end.setMonth(end.getMonth() + 1);

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data:  { status: "PAID", validatedBy: req.user.id, validatedAt: now },
    }),
    prisma.user.update({ where: { id: payment.userId }, data: { plan: payment.plan } }),
    prisma.subscription.create({
      data: {
        userId: payment.userId, plan: payment.plan, status: "active",
        currentPeriodStart: now, currentPeriodEnd: end,
      },
    }),
  ]);

  res.json({ message: "Plan activé avec succès" });
});

// ─── ADMIN : Rejeter ─────────────────────────────────────────────────────────
router.post("/admin/reject/:id", requireAdmin, async (req, res) => {
  await prisma.payment.update({
    where: { id: Number(req.params.id) },
    data:  { status: "FAILED" },
  });
  res.json({ message: "Paiement rejeté" });
});

// ─── USER : Mon abonnement actuel ────────────────────────────────────────────
router.get("/my-subscription", requireAuth, async (req, res) => {
  const sub = await prisma.subscription.findFirst({
    where:   { userId: req.user.id, status: "active" },
    orderBy: { createdAt: "desc" },
  });
  res.json(sub);
});

export default router;