import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../../middleware/admin.js";

const router = Router();
const prisma = new PrismaClient();

// ─── STATS GLOBALES ───────────────────────────────────────────────────────────
router.get("/stats", requireAdmin, async (req, res) => {
  const [
    totalUsers, totalLinks, totalClicks,
    usersByPlan, revenueData, recentSignups, recentClicks,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
    prisma.clickLog.count(),

    prisma.user.groupBy({ by: ["plan"], _count: { id: true } }),

    // Revenus totaux des paiements PAID
    prisma.payment.aggregate({
      where:  { status: "PAID" },
      _sum:   { amount: true },
      _count: { id: true },
    }),

    // Inscriptions des 7 derniers jours
    prisma.user.findMany({
      where:   { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } },
      select:  { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),

    // Clics des 7 derniers jours
    prisma.clickLog.findMany({
      where:   { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } },
      select:  { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Grouper par jour
  const groupByDay = (items) => {
    const map = {};
    items.forEach(({ createdAt }) => {
      const day = new Date(createdAt).toISOString().slice(0, 10);
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  };

  res.json({
    totalUsers,
    totalLinks,
    totalClicks,
    totalRevenue: revenueData._sum.amount || 0,
    totalPayments: revenueData._count.id,
    usersByPlan: Object.fromEntries(usersByPlan.map(p => [p.plan, p._count.id])),
    signupsPerDay: groupByDay(recentSignups),
    clicksPerDay:  groupByDay(recentClicks),
  });
});

// ─── UTILISATEURS ─────────────────────────────────────────────────────────────
router.get("/users", requireAdmin, async (req, res) => {
  const { search, plan, page = 1 } = req.query;
  const take = 10;
  const skip = (Number(page) - 1) * take;

  const where = {
    ...(plan   && { plan }),
    ...(search && {
      OR: [
        { email: { contains: search, mode: "insensitive" } },
        { name:  { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, email: true, name: true, plan: true,
        isAdmin: true, createdAt: true,
        _count: { select: { links: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({ users, total, pages: Math.ceil(total / take) });
});

// Changer le plan d'un utilisateur
router.patch("/users/:id/plan", requireAdmin, async (req, res) => {
  const { plan } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data:  { plan },
  });
  res.json(user);
});

// Bannir / débannir (isActive sur les liens)
router.patch("/users/:id/ban", requireAdmin, async (req, res) => {
  const { banned } = req.body;
  // Désactiver tous les liens de l'utilisateur
  await prisma.link.updateMany({
    where: { userId: Number(req.params.id) },
    data:  { isActive: !banned },
  });
  res.json({ message: banned ? "Utilisateur banni" : "Utilisateur débanni" });
});

// Réinitialiser au plan FREE
router.patch("/users/:id/reset", requireAdmin, async (req, res) => {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: Number(req.params.id) },
      data:  { plan: "FREE" },
    }),
    prisma.subscription.updateMany({
      where: { userId: Number(req.params.id), status: "active" },
      data:  { status: "cancelled" },
    }),
  ]);
  res.json({ message: "Plan réinitialisé à FREE" });
});

// ─── LIENS ────────────────────────────────────────────────────────────────────
router.get("/links", requireAdmin, async (req, res) => {
  const { search, page = 1 } = req.query;
  const take = 10;
  const skip = (Number(page) - 1) * take;

  const where = search
    ? { OR: [{ slug: { contains: search } }, { url: { contains: search } }] }
    : {};

  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where, skip, take,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, email: true, plan: true } } },
    }),
    prisma.link.count({ where }),
  ]);

  res.json({ links, total, pages: Math.ceil(total / take) });
});

// Supprimer un lien
router.delete("/links/:id", requireAdmin, async (req, res) => {
  await prisma.link.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// Activer / désactiver un lien
router.patch("/links/:id/toggle", requireAdmin, async (req, res) => {
  const link = await prisma.link.findUnique({ where: { id: Number(req.params.id) } });
  const updated = await prisma.link.update({
    where: { id: Number(req.params.id) },
    data:  { isActive: !link.isActive },
  });
  res.json(updated);
});

// ─── PAIEMENTS ────────────────────────────────────────────────────────────────
router.get("/payments", requireAdmin, async (req, res) => {
  const { status, method, page = 1 } = req.query;
  const take = 10;
  const skip = (Number(page) - 1) * take;

  const where = {
    ...(status && { status }),
    ...(method && { method }),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where, skip, take,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
    prisma.payment.count({ where }),
  ]);

  res.json({ payments, total, pages: Math.ceil(total / take) });
});

router.post("/payments/:id/validate", requireAdmin, async (req, res) => {
  const payment = await prisma.payment.findUnique({ where: { id: Number(req.params.id) } });
  if (!payment || payment.status !== "PENDING")
    return res.status(400).json({ error: "Paiement introuvable ou déjà traité" });

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

  res.json({ message: "Plan activé" });
});

router.post("/payments/:id/reject", requireAdmin, async (req, res) => {
  await prisma.payment.update({
    where: { id: Number(req.params.id) },
    data:  { status: "FAILED" },
  });
  res.json({ message: "Paiement rejeté" });
});

export default router;