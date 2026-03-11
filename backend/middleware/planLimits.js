import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const LIMITS = {
  FREE:     { links: 10,       clicks: 1_000,    qrCode: false, customSlug: false, customDomain: false, expiry: 3,    maxClicks: false },
  PRO:      { links: 500,      clicks: 50_000,   qrCode: true,  customSlug: true,  customDomain: false, expiry: true, maxClicks: true  },
  BUSINESS: { links: Infinity, clicks: Infinity, qrCode: true,  customSlug: true,  customDomain: true,  expiry: true, maxClicks: true  },
};
// expiry: 3 = max 3 jours, true = libre, false = pas d'expiration personnalisée

export async function checkLinkLimit(req, res, next) {
  const limit = LIMITS[req.user.plan].links;
  if (limit === Infinity) return next();
  const count = await prisma.link.count({ where: { userId: req.user.id } });
  if (count >= limit)
    return res.status(403).json({ error: `Limite de ${limit} liens atteinte. Passez à un plan supérieur.`, upgrade: true });
  next();
}

export function checkCustomSlug(req, res, next) {
  if (req.body.customSlug && !LIMITS[req.user.plan].customSlug)
    return res.status(403).json({ error: "Les slugs personnalisés sont réservés aux plans Pro et Business.", upgrade: true });
  next();
}

export function checkQrCode(req, res, next) {
  if (!LIMITS[req.user.plan].qrCode)
    return res.status(403).json({ error: "Les QR Codes sont réservés aux plans Pro et Business.", upgrade: true });
  next();
}