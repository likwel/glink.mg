import { useState, useEffect } from "react";
import { adminAPI } from "../api.js";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconStats   = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z"/></svg>;
const IconUsers   = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/></svg>;
const IconLinks   = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m3.242-9.173a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656L13.07 5.07"/></svg>;
const IconPay     = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2"/><path strokeLinecap="round" d="M1 10h22"/></svg>;
const IconCheck   = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const IconX       = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IconTrash   = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconSearch  = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/></svg>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PLAN_COLOR = {
  FREE:     "bg-gray-100 text-gray-600",
  PRO:      "bg-indigo-100 text-indigo-700",
  BUSINESS: "bg-purple-100 text-purple-700",
};
const STATUS_COLOR = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  PAID:      "bg-green-100 text-green-700",
  FAILED:    "bg-red-100 text-red-600",
  CANCELLED: "bg-gray-100 text-gray-500",
};
const fmt     = (n) => n?.toLocaleString("fr-MG") + " Ar";
const fmtDate = (d) => new Date(d).toLocaleDateString("fr-MG");

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "text-black" }) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function MiniBar({ data, color = "bg-indigo-500" }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((d, i) => (
        <div key={i} className="flex-1">
          <div className={`w-full rounded-sm ${color}`}
            style={{ height: `${(d.count / max) * 40}px`, minHeight: 2 }} />
        </div>
      ))}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, total, pageSize, onChange }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  const pageNums = Array.from({ length: pages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  const go = (p) => { onChange(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t">
      <span className="text-xs text-gray-400">{from}–{to} sur {total}</span>
      <div className="flex gap-1">
        <button onClick={() => go(1)} disabled={page === 1}
          className="px-2.5 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50">«</button>
        <button onClick={() => go(page - 1)} disabled={page === 1}
          className="px-2.5 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50">‹</button>
        {pageNums.map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} className="px-2 py-1 text-xs text-gray-400">…</span>
            : <button key={p} onClick={() => go(p)}
                className={`px-2.5 py-1 border rounded-lg text-xs transition-all ${p === page ? "bg-black text-white border-black" : "hover:bg-gray-50"}`}>
                {p}
              </button>
        )}
        <button onClick={() => go(page + 1)} disabled={page >= pages}
          className="px-2.5 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50">›</button>
        <button onClick={() => go(pages)} disabled={page >= pages}
          className="px-2.5 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50">»</button>
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "stats",    label: "Statistiques", icon: <IconStats /> },
  { id: "payments", label: "Paiements",    icon: <IconPay />   },
  { id: "users",    label: "Utilisateurs", icon: <IconUsers /> },
  { id: "links",    label: "Liens",        icon: <IconLinks /> },
];

export default function Admin() {
  const [tab, setTab] = useState("stats");
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Panel Admin</h1>
        <p className="text-sm text-gray-400">glink.mg — Super Admin</p>
      </div>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
            }`}>
            {t.icon} <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>
      {tab === "stats"    && <StatsTab />}
      {tab === "payments" && <PaymentsTab />}
      {tab === "users"    && <UsersTab />}
      {tab === "links"    && <LinksTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB : STATS
// ═══════════════════════════════════════════════════════════════════════════════
function StatsTab() {
  const [data, setData] = useState(null);
  useEffect(() => { adminAPI.stats().then(setData).catch(console.error); }, []);
  if (!data) return <p className="text-gray-400 text-center py-20">Chargement…</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Utilisateurs"  value={data.totalUsers}                   color="text-indigo-600" />
        <StatCard label="Liens créés"   value={data.totalLinks}                   color="text-purple-600" />
        <StatCard label="Clics totaux"  value={data.totalClicks.toLocaleString()} color="text-blue-600" />
        <StatCard label="Revenus"       value={fmt(data.totalRevenue)}
          sub={`${data.totalPayments} paiements`} color="text-green-600" />
      </div>
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Répartition des plans</h2>
        <div className="flex gap-4">
          {["FREE","PRO","BUSINESS"].map(p => (
            <div key={p} className="flex-1 text-center">
              <span className={`text-xs font-bold px-2 py-1 rounded-full inline-block mb-2 ${PLAN_COLOR[p]}`}>{p}</span>
              <p className="text-2xl font-black">{data.usersByPlan[p] || 0}</p>
              <p className="text-xs text-gray-400">utilisateurs</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-2xl p-5">
          <h2 className="font-semibold mb-1 text-sm">Inscriptions (7 jours)</h2>
          <MiniBar data={data.signupsPerDay} color="bg-indigo-500" />
          <div className="flex justify-between mt-1">
            {data.signupsPerDay.map((d, i) => (
              <span key={i} className="text-xs text-gray-400">{d.date.slice(5)}</span>
            ))}
          </div>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <h2 className="font-semibold mb-1 text-sm">Clics (7 jours)</h2>
          <MiniBar data={data.clicksPerDay} color="bg-purple-500" />
          <div className="flex justify-between mt-1">
            {data.clicksPerDay.map((d, i) => (
              <span key={i} className="text-xs text-gray-400">{d.date.slice(5)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB : PAIEMENTS
// ═══════════════════════════════════════════════════════════════════════════════
function PaymentsTab() {
  const [data, setData]       = useState(null);
  const [page, setPage]       = useState(1);
  const [status, setStatus]   = useState("");
  const [method, setMethod]   = useState("");
  const [loading, setLoading] = useState(null);

  const load = (p) => adminAPI.payments({
    page: p,
    ...(status && { status }),
    ...(method && { method }),
  }).then(setData).catch(console.error);

  useEffect(() => { load(page); }, [page, status, method]);

  const act = async (id, action) => {
    setLoading(id + action);
    await (action === "validate" ? adminAPI.validatePayment(id) : adminAPI.rejectPayment(id));
    setLoading(null);
    load(page);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="border rounded-xl px-3 py-2 text-sm">
          <option value="">Tous statuts</option>
          <option value="PENDING">En attente</option>
          <option value="PAID">Payé</option>
          <option value="FAILED">Rejeté</option>
        </select>
        <select value={method} onChange={e => { setMethod(e.target.value); setPage(1); }}
          className="border rounded-xl px-3 py-2 text-sm">
          <option value="">Toutes méthodes</option>
          <option value="MANUAL">Mobile Money</option>
          <option value="STRIPE">Stripe</option>
        </select>
        <button onClick={() => load(page)}
          className="flex items-center gap-1.5 border rounded-xl px-3 py-2 text-sm hover:bg-gray-50 ml-auto">
          <IconRefresh /> Rafraîchir
        </button>
      </div>

      {!data ? <p className="text-gray-400 text-center py-20">Chargement…</p> : (
        <>
          <div className="space-y-3">
            {data.payments.map(p => (
              <div key={p.id} className="bg-white border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{p.user.name || p.user.email}</p>
                    <p className="text-xs text-gray-400">{p.user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status]}`}>{p.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${PLAN_COLOR[p.plan]}`}>{p.plan}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-black">{fmt(p.amount)}</span>
                  <span>{p.billingPeriod === "yearly" ? "Annuel" : "Mensuel"}</span>
                  <span>{p.method === "MANUAL" ? "📱 Mobile Money" : "💳 Stripe"}</span>
                  <span>{fmtDate(p.createdAt)}</span>
                </div>
                {p.proofUrl && (
                  <a href={p.proofUrl} target="_blank" rel="noreferrer"
                    className="text-xs text-indigo-500 hover:underline block mb-2 truncate">
                    🔗 Preuve : {p.proofUrl}
                  </a>
                )}
                {p.status === "PENDING" && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => act(p.id, "validate")} disabled={loading === p.id + "validate"}
                      className="flex items-center gap-1.5 flex-1 justify-center bg-green-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-green-700 disabled:opacity-50">
                      <IconCheck /> Valider
                    </button>
                    <button onClick={() => act(p.id, "reject")} disabled={loading === p.id + "reject"}
                      className="flex items-center gap-1.5 flex-1 justify-center bg-red-100 text-red-600 py-2 rounded-xl text-xs font-semibold hover:bg-red-200 disabled:opacity-50">
                      <IconX /> Rejeter
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Pagination page={page} total={data.total} pageSize={10} onChange={(p) => setPage(p)} />
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB : UTILISATEURS
// ═══════════════════════════════════════════════════════════════════════════════
function UsersTab() {
  const [data, setData]             = useState(null);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [loading, setLoading]       = useState(null);

  const load = (p) => adminAPI.users({
    page: p,
    ...(search     && { search }),
    ...(planFilter && { plan: planFilter }),
  }).then(setData).catch(console.error);

  useEffect(() => { load(page); }, [page, planFilter]);

  const changePlan = async (id, plan) => {
    setLoading(id + "plan");
    await adminAPI.updatePlan(id, plan);
    setLoading(null); load(page);
  };

  const ban = async (id, banned) => {
    setLoading(id + "ban");
    await adminAPI.banUser(id, banned);
    setLoading(null); load(page);
  };

  const reset = async (id) => {
    if (!confirm("Réinitialiser au plan FREE ?")) return;
    setLoading(id + "reset");
    await adminAPI.resetUser(id);
    setLoading(null); load(page);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch /></span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { setPage(1); load(1); } }}
            placeholder="Rechercher email ou nom… (Entrée)"
            className="w-full border rounded-xl pl-9 pr-4 py-2 text-sm" />
        </div>
        <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
          className="border rounded-xl px-3 py-2 text-sm">
          <option value="">Tous les plans</option>
          <option value="FREE">Free</option>
          <option value="PRO">Pro</option>
          <option value="BUSINESS">Business</option>
        </select>
      </div>

      {!data ? <p className="text-gray-400 text-center py-20">Chargement…</p> : (
        <>
          <div className="space-y-3">
            {data.users.map(u => (
              <div key={u.id} className="bg-white border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{u.name || "—"}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Inscrit le {fmtDate(u.createdAt)} · {u._count.links} liens
                      {u.isAdmin && <span className="ml-2 text-red-500 font-bold">ADMIN</span>}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${PLAN_COLOR[u.plan]}`}>{u.plan}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <select defaultValue={u.plan}
                    onChange={e => changePlan(u.id, e.target.value)}
                    disabled={loading === u.id + "plan"}
                    className="border rounded-lg px-2 py-1 text-xs">
                    <option value="FREE">Free</option>
                    <option value="PRO">Pro</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                  <button onClick={() => reset(u.id)} disabled={loading === u.id + "reset"}
                    className="flex items-center gap-1 border px-3 py-1 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-50">
                    <IconRefresh /> Reset FREE
                  </button>
                  <button onClick={() => ban(u.id, true)} disabled={loading === u.id + "ban"}
                    className="flex items-center gap-1 border border-red-200 text-red-500 px-3 py-1 rounded-lg text-xs hover:bg-red-50 disabled:opacity-50 ml-auto">
                    <IconX /> Bannir
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} total={data.total} pageSize={10} onChange={(p) => setPage(p)} />
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB : LIENS
// ═══════════════════════════════════════════════════════════════════════════════
function LinksTab() {
  const [data, setData]       = useState(null);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(null);

  const load = (p) => adminAPI.links({
    page: p,
    ...(search && { search }),
  }).then(setData).catch(console.error);

  useEffect(() => { load(page); }, [page]);

  const del = async (id) => {
    if (!confirm("Supprimer ce lien ?")) return;
    setLoading(id + "del");
    await adminAPI.deleteLink(id);
    setLoading(null); load(page);
  };

  const toggle = async (id) => {
    setLoading(id + "toggle");
    await adminAPI.toggleLink(id);
    setLoading(null); load(page);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch /></span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { setPage(1); load(1); } }}
            placeholder="Rechercher slug ou URL… (Entrée)"
            className="w-full border rounded-xl pl-9 pr-4 py-2 text-sm" />
        </div>
        <button onClick={() => { setPage(1); load(1); }}
          className="flex items-center gap-1.5 border rounded-xl px-3 py-2 text-sm hover:bg-gray-50">
          <IconRefresh /> Chercher
        </button>
      </div>

      {!data ? <p className="text-gray-400 text-center py-20">Chargement…</p> : (
        <>
          <div className="space-y-2">
            {data.links.map(l => (
              <div key={l.id} className={`bg-white border rounded-2xl p-4 flex items-center gap-3 ${!l.isActive ? "opacity-60" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-sm font-semibold text-indigo-600">/{l.slug}</span>
                    {!l.isActive && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Inactif</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${PLAN_COLOR[l.user.plan]}`}>{l.user.plan}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{l.url}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l.user.email} · {l.clicks} clics · {fmtDate(l.createdAt)}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => toggle(l.id)} disabled={loading === l.id + "toggle"}
                    className="border px-2.5 py-1.5 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-50">
                    {l.isActive ? "Désactiver" : "Activer"}
                  </button>
                  <button onClick={() => del(l.id)} disabled={loading === l.id + "del"}
                    className="border border-red-200 text-red-500 px-2.5 py-1.5 rounded-lg text-xs hover:bg-red-50 disabled:opacity-50">
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} total={data.total} pageSize={10} onChange={(p) => setPage(p)} />
        </>
      )}
    </div>
  );
}