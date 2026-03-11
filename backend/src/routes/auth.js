import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

const sign = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ─── Register ─────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email et mot de passe requis" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email déjà utilisé" });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, name } });

  res.json({ token: sign(user), user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

  res.json({ token: sign(user), user: { id: user.id, email: user.email, name: user.name, plan: user.plan, isAdmin: user.isAdmin } });
});

// ─── Me ───────────────────────────────────────────────────────────────────────
router.get("/me", requireAuth, (req, res) => {
  const { id, email, name, plan, isAdmin } = req.user;
  res.json({ id, email, name, plan, isAdmin });
});

export default router;