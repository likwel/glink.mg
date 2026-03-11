import { requireAuth } from "./auth.js";

export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    if (!req.user.isAdmin)
      return res.status(403).json({ error: "Accès admin requis" });
    next();
  });
}