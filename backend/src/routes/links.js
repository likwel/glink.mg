import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import { requireAuth } from "../../middleware/auth.js";
import { checkLinkLimit, checkCustomSlug, LIMITS } from "../../middleware/planLimits.js";

const router = Router();
const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isExpired(link) {
  if (link.expiresAt && new Date() > new Date(link.expiresAt)) return true;
  if (link.maxClicks  && link.clicks >= link.maxClicks)        return true;
  return false;
}

function expiryReason(link) {
  if (!link.isActive)                                           return "désactivé";
  if (link.expiresAt && new Date() > new Date(link.expiresAt)) return "date dépassée";
  if (link.maxClicks  && link.clicks >= link.maxClicks)         return "limite de clics atteinte";
  return null;
}

// ─── REDIRECTION (monté dans index.js sur /:slug) ────────────────────────────
export async function redirectLink(req, res) {
  const { slug } = req.params;
  const link = await prisma.link.findUnique({ where: { slug } });

  if (isExpired(link)) {
    await prisma.link.update({ where: { slug }, data: { isActive: false } });
    return res.status(410).sendFile("expired.html", { root: "public" });
  }

  if (!link || !link.isActive)
    return res.status(404).sendFile("404.html", { root: "public" });

  await prisma.$transaction([
    prisma.link.update({ where: { slug }, data: { clicks: { increment: 1 } } }),
    prisma.clickLog.create({
      data: { linkId: link.id, ip: req.ip, userAgent: req.headers["user-agent"] },
    }),
  ]);

  res.redirect(302, link.url);
}

// ─── CRON : désactiver les liens expirés ─────────────────────────────────────
export async function deactivateExpiredLinks() {
  const now = new Date();

  const byDate = await prisma.link.updateMany({
    where: { isActive: true, expiresAt: { lte: now } },
    data:  { isActive: false },
  });

  const byClicks = await prisma.$executeRaw`
    UPDATE "Link"
    SET "isActive" = false
    WHERE "isActive" = true
      AND "maxClicks" IS NOT NULL
      AND "clicks" >= "maxClicks"
  `;

  console.log(`[cron] ${byDate.count} expirés par date, ${byClicks} par clics`);
}

// ─── Créer un lien ────────────────────────────────────────────────────────────
router.post("/", requireAuth, checkLinkLimit, checkCustomSlug, async (req, res) => {
  const { url, customSlug, expiresAt, maxClicks } = req.body;
  const user = req.user;

  if (!url) return res.status(400).json({ error: "URL requise" });

  const expiryLimit = LIMITS[user.plan].expiry;

  // Plan FREE : expiration forcée à 3 jours max
  let finalExpiresAt = expiresAt ? new Date(expiresAt) : null;
  if (typeof expiryLimit === "number") {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + expiryLimit);
    // On ignore la date fournie et on impose le max du plan
    finalExpiresAt = maxDate;
  } else if (expiryLimit === false && expiresAt) {
    return res.status(403).json({ error: "Expiration par date réservée aux plans Pro/Business.", upgrade: true });
  }

  if (maxClicks && !LIMITS[user.plan].maxClicks)
    return res.status(403).json({ error: "Expiration par clics réservée aux plans Pro/Business.", upgrade: true });

  const slug = customSlug || nanoid(6);

  try {
    const link = await prisma.link.create({
      data: {
        slug,
        url,
        userId:    user.id,
        expiresAt: finalExpiresAt,
        maxClicks: maxClicks ? Number(maxClicks) : null,
      },
    });
    res.json(link);
  } catch {
    res.status(409).json({ error: "Ce slug est déjà utilisé" });
  }
});

// ─── Lister les liens ─────────────────────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  const links = await prisma.link.findMany({
    where:   { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(links.map(l => ({ ...l, expired: isExpired(l), expiryReason: expiryReason(l) })));
});

// ─── Mettre à jour un lien ────────────────────────────────────────────────────
router.patch("/:id", requireAuth, async (req, res) => {
  const id   = Number(req.params.id);
  const user = req.user;
  const { url, expiresAt, maxClicks, isActive } = req.body;

  const link = await prisma.link.findUnique({ where: { id } });
  if (!link || link.userId !== user.id)
    return res.status(404).json({ error: "Lien introuvable" });

  if (expiresAt !== undefined && !LIMITS[user.plan].expiry)
    return res.status(403).json({ error: "Expiration réservée aux plans Pro/Business.", upgrade: true });

  const updated = await prisma.link.update({
    where: { id },
    data: {
      ...(url       !== undefined && { url }),
      ...(isActive  !== undefined && { isActive }),
      ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      ...(maxClicks !== undefined && { maxClicks: maxClicks ? Number(maxClicks) : null }),
    },
  });
  res.json(updated);
});

// ─── Supprimer un lien ────────────────────────────────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  const id   = Number(req.params.id);
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link || link.userId !== req.user.id)
    return res.status(404).json({ error: "Lien introuvable" });
  await prisma.link.delete({ where: { id } });
  res.json({ success: true });
});

export default router;