import express from "express";
import cors from "cors";
import cron from "node-cron";
import authRoutes    from "./routes/auth.js";
import linkRoutes,  { redirectLink, deactivateExpiredLinks } from "./routes/links.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes   from "./routes/admin.js";

const app = express();

// Webhook Stripe : raw body AVANT express.json()
app.use("/api/payments/stripe/webhook", express.raw({ type: "application/json" }));

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ─── Routes API ───────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/links",    linkRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin",    adminRoutes);

// ─── Redirection short link ───────────────────────────────────────────────────
app.get("/:slug", redirectLink);

// ─── Cron : désactiver les liens expirés toutes les 10 minutes ────────────────
cron.schedule("*/10 * * * *", () => {
  deactivateExpiredLinks().catch(console.error);
});

app.listen(3000, () => console.log("🚀 glink.mg backend running on :3000"));