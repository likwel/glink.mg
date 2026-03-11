import { useState, useRef } from "react";
import { Link } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconCheck  = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const IconX      = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IconLink   = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m3.242-9.173a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656L13.07 5.07"/></svg>;
const IconClick  = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6 6m0 0l-3-3m3 3V9a3 3 0 0 1 6 0v3"/></svg>;
const IconSlug   = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>;
const IconChart  = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z"/></svg>;
const IconQr     = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path strokeLinecap="round" d="M14 14h3v3h-3zm3 3h3v3h-3zm0-3h3"/></svg>;
const IconDomain = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconSupport= () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-5 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>;
const IconClock  = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>;
const IconExport = () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;
const IconBolt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
    style={{ filter: "drop-shadow(0 0 5px #FFD93D)" }}>
    <defs>
      <linearGradient id="boltPricing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE566" />
        <stop offset="100%" stopColor="#FF9500" />
      </linearGradient>
    </defs>
    <path d="M14.5 2.5L5 13.5h6.5L9.5 21.5l9.5-11h-6.5L14.5 2.5z"
      fill="url(#boltPricing)" stroke="#CC7000" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const BoltBadge = () => (
  <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 999, padding: "6px 14px", display:"inline-flex", alignItems:"center", gap: 6, boxShadow: "0 2px 12px #6366f155" }}>
    <IconBolt />
    <span style={{ color:"white", fontWeight:800, fontSize:16, letterSpacing:1 }}>glink.mg</span>
  </div>
);

const IconSuccess = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke="#16a34a" d="M7 13l3.5 3.5L17 9"/>
  </svg>
);

const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>;
const IconPhone  = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="2"/><path strokeLinecap="round" d="M12 18h.01"/></svg>;
const IconCard2  = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2"/><path strokeLinecap="round" d="M1 10h22"/></svg>;
const plans = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    color: "border-gray-200",
    btnClass: "bg-gray-100 text-gray-400 cursor-default",
    badge: null,
    features: [
      { icon: <IconLink />,    label: "10 short links" },
      { icon: <IconClick />,   label: "1 000 clics / mois" },
      { icon: <IconClock />,   label: "Expiration : 3 jours max", highlight: true },
      { icon: <IconChart />,   label: "Statistiques basiques" },
      { icon: <IconSlug />,    label: "Slug personnalisé",  ok: false },
      { icon: <IconQr />,      label: "QR Code",            ok: false },
      { icon: <IconDomain />,  label: "Domaine custom",     ok: false },
      { icon: <IconSupport />, label: "Support",            ok: false },
    ],
  },
  {
    name: "Pro",
    monthly: 9900,
    yearly: 99000,
    color: "border-indigo-500",
    btnClass: "bg-indigo-600 text-white hover:bg-indigo-700",
    badge: "Populaire",
    badgeColor: "bg-indigo-600",
    features: [
      { icon: <IconLink />,    label: "500 short links" },
      { icon: <IconClick />,   label: "50 000 clics / mois" },
      { icon: <IconClock />,   label: "Expiration personnalisée (date + clics)" },
      { icon: <IconChart />,   label: "Statistiques avancées" },
      { icon: <IconSlug />,    label: "Slug personnalisé" },
      { icon: <IconQr />,      label: "QR Code" },
      { icon: <IconDomain />,  label: "Domaine custom",    ok: false },
      { icon: <IconSupport />, label: "Support email" },
    ],
  },
  {
    name: "Business",
    monthly: 24900,
    yearly: 249000,
    color: "border-purple-500",
    btnClass: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
    badge: "Complet",
    badgeColor: "bg-purple-600",
    features: [
      { icon: <IconLink />,    label: "Links illimités" },
      { icon: <IconClick />,   label: "Clics illimités" },
      { icon: <IconClock />,   label: "Expiration personnalisée (date + clics)" },
      { icon: <IconChart />,   label: "Stats avancées" },
      { icon: <IconExport />,  label: "Export des statistiques" },
      { icon: <IconSlug />,    label: "Slug personnalisé" },
      { icon: <IconQr />,      label: "QR Code" },
      { icon: <IconDomain />,  label: "Domaine custom" },
      { icon: <IconSupport />, label: "Support prioritaire" },
    ],
  },
];

function fmt(n) {
  if (n === 0) return "Gratuit";
  return n.toLocaleString("fr-MG") + " Ar";
}

function saving(p) {
  return Math.round(((p.monthly * 12 - p.yearly) / (p.monthly * 12)) * 100);
}

export default function Pricing() {
  const [billing, setBilling]       = useState("monthly");
  const [loading, setLoading]       = useState(null);
  const [modal, setModal]           = useState(null);        // { plan, billing }
  const [manualModal, setManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({ operator: "mvola", phone: "", txRef: "", proofUrl: "" });
  const [proofFile, setProofFile]   = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);   // "loading" | "success" | "error"
  const fileRef = useRef();

  const handleChoose = (plan) => {
    if (plan.name === "Free") return;
    setModal({ plan, billing });
  };

  const handleStripe = async () => {
    setLoading("stripe");
    try {
      const res = await fetch("/api/payments/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ plan: modal.plan.name.toUpperCase(), billing }),
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err){
        console.error("Stripe error:", err);
        alert("Erreur lors de la connexion à Stripe.");
    } finally {
      setLoading(null);
      setModal(null);
    }
  };

  const handleManual = () => {
    // On garde modal en mémoire pour récupérer plan + billing dans submitManual
    setManualModal(true);
  };

  const setField = (k) => (e) => setManualForm(f => ({ ...f, [k]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFile(file);
    // Convertir en base64 data URL pour prévisualisation
    const reader = new FileReader();
    reader.onload = () => setManualForm(f => ({ ...f, proofUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const submitManual = async () => {
    if (!manualForm.phone || !manualForm.txRef)
      return alert("Numéro et référence de transaction requis.");
    setSubmitStatus("loading");
    try {
      const res = await fetch("/api/payments/manual/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          plan:         modal.plan.name.toUpperCase(),
          billing,
          proofUrl:     manualForm.proofUrl || `TEL:${manualForm.phone} REF:${manualForm.txRef}`,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  const OPERATORS = [
    { id: "mvola",        label: "MVola",        color: "border-red-400    bg-red-50",    num: "034 85 234 79", name :'Jean' },
    { id: "orange_money", label: "Orange Money", color: "border-orange-400 bg-orange-50", num: "032 43 236 01", name : 'Andriatsitohaina Elie' },
    // { id: "airtel_money", label: "Airtel Money", color: "border-red-600    bg-red-50",    num: "033 07 434 34" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <div className="flex items-center gap-1 font-bold text-lg tracking-tight">
            <span className="text-black"><IconLink /></span>
            glink<span className="text-indigo-500">.mg</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Choisissez votre forfait</h1>
        <p className="text-gray-500">Simple, transparent, adapté au marché malgache.</p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-1 mt-6 bg-white border rounded-full px-2 py-1 shadow-sm">
          <button onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "bg-indigo-600 text-white" : "text-gray-500"}`}>
            Mensuel
          </button>
          <button onClick={() => setBilling("yearly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billing === "yearly" ? "bg-indigo-600 text-white" : "text-gray-500"}`}>
            Annuel
            <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">-17%</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className={`relative bg-white rounded-2xl border-2 ${p.color} p-7 shadow-sm flex flex-col`}>
            {p.badge && (
              <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold ${p.badgeColor} text-white px-3 py-1 rounded-full`}>
                {p.badge}
              </span>
            )}

            <h2 className="text-xl font-bold mb-1">{p.name}</h2>

            <div className="mt-2 mb-6">
              <span className="text-3xl font-black">
                {fmt(billing === "monthly" ? p.monthly : p.yearly)}
              </span>
              {p.monthly > 0 && (
                <span className="text-gray-400 text-sm ml-1">/{billing === "monthly" ? "mois" : "an"}</span>
              )}
              {billing === "yearly" && p.monthly > 0 && (
                <p className="text-green-600 text-xs mt-1">
                  Économisez {saving(p)}% vs mensuel
                </p>
              )}
            </div>

            <ul className="space-y-2.5 flex-1 mb-7">
              {p.features.map((f, i) => {
                const enabled = f.ok !== false;
                return (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    {/* icône feature */}
                    <span className={enabled ? "text-indigo-500" : "text-gray-300"}>
                      {f.icon}
                    </span>
                    {/* label */}
                    <span className={
                      f.highlight
                        ? "text-orange-600 font-medium"
                        : enabled ? "text-gray-700" : "text-gray-350 line-through"
                    }>
                      {f.label}
                    </span>
                    {/* check / cross */}
                    <span className={`ml-auto shrink-0 ${enabled ? "text-green-500" : "text-gray-300"}`}>
                      {enabled ? <IconCheck /> : <IconX />}
                    </span>
                  </li>
                );
              })}
            </ul>

            <button onClick={() => handleChoose(p)}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${p.btnClass}`}>
              {p.name === "Free" ? "Plan actuel" : `Choisir ${p.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Modal choix paiement */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold mb-1">Plan {modal.plan.name}</h3>
            <p className="text-gray-500 text-sm mb-6">
              {fmt(billing === "monthly" ? modal.plan.monthly : modal.plan.yearly)} / {billing === "monthly" ? "mois" : "an"}
            </p>
            <div className="space-y-3">
              <button onClick={handleStripe} disabled={loading === "stripe"}
                className="w-full flex items-center gap-3 border-2 border-indigo-500 rounded-xl px-4 py-3 hover:bg-indigo-50 transition-all">
                <span className="text-indigo-500"><IconCard2 /></span>
                <div className="text-left">
                  <p className="font-semibold text-sm">Carte bancaire</p>
                  <p className="text-xs text-gray-400">Via Stripe — immédiat</p>
                </div>
                {loading === "stripe" && <span className="ml-auto text-xs text-indigo-500 animate-pulse">Chargement…</span>}
              </button>
              <button onClick={handleManual}
                className="w-full flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-all">
                <span className="text-gray-500"><IconPhone /></span>
                <div className="text-left">
                  <p className="font-semibold text-sm">Mobile Money</p>
                  <p className="text-xs text-gray-400">MVola · Orange Money · Airtel — validation 24h</p>
                </div>
              </button>
            </div>
            <button onClick={() => setModal(null)} className="mt-5 w-full text-center text-sm text-gray-400 hover:text-gray-600">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Modal Mobile Money */}
      {manualModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-xl">

            {submitStatus === "success" ? (
              <div className="text-center py-6">
                <div className="flex justify-center mb-4"><IconSuccess /></div>
                <h3 className="text-xl font-bold mb-2">Paiement soumis !</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Votre paiement est en cours de vérification. Votre plan sera activé sous <strong>24h ouvrées</strong>.
                </p>
                <button onClick={() => {                   setManualModal(false); setModal(null); setSubmitStatus(null);
                  setManualForm({ operator: "mvola", phone: "", txRef: "", proofUrl: "" });
                  setProofFile(null); }}
                  className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium">
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-1">Paiement Mobile Money</h3>
                <p className="text-gray-400 text-sm mb-5">Choisissez votre opérateur et suivez les étapes.</p>

                {/* Choix opérateur */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {OPERATORS.map(op => (
                    <button key={op.id} onClick={() => setManualForm(f => ({ ...f, operator: op.id }))}
                      className={`border-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${manualForm.operator === op.id ? op.color + " border-opacity-100" : "border-gray-200 text-gray-500"}`}>
                      {op.label}
                    </button>
                  ))}
                </div>

                {/* Instructions */}
                {(() => {
                  const op = OPERATORS.find(o => o.id === manualForm.operator);
                  const amount = fmt(billing === "monthly" ? modal?.plan?.monthly ?? 9900 : modal?.plan?.yearly ?? 99000);
                  return (
                    <div className="bg-gray-50 border rounded-xl px-4 py-3 mb-5 text-sm space-y-1">
                      <p className="font-semibold text-gray-700 mb-2">Instructions</p>
                      <p>1. Envoyez <strong>{amount}</strong> au numéro :</p>
                      <p className="font-mono text-lg font-bold text-center py-1">{op.num}</p>
                      <p>2. Notez la <strong>référence de transaction</strong></p>
                      <p>3. Remplissez le formulaire ci-dessous</p>
                    </div>
                  );
                })()}

                {/* Formulaire */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Votre numéro {OPERATORS.find(o => o.id === manualForm.operator)?.label}</label>
                    <input value={manualForm.phone} onChange={setField("phone")}
                      placeholder="ex: 034 XX XXX XX"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Référence de transaction *</label>
                    <input value={manualForm.txRef} onChange={setField("txRef")}
                      placeholder="ex: TXN123456789"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Capture d'écran (optionnel)</label>
                    <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={() => fileRef.current.click()}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-all">
                      <IconUpload />
                      {proofFile ? proofFile.name : "Choisir une image"}
                    </button>
                    {proofFile && (
                      <img src={manualForm.proofUrl} alt="preuve" className="mt-2 rounded-xl w-full max-h-32 object-cover border" />
                    )}
                  </div>
                </div>

                {submitStatus === "error" && (
                  <p className="text-red-500 text-sm mt-3">Une erreur est survenue. Réessayez.</p>
                )}

                <div className="flex gap-2 mt-5">
                  <button onClick={() => { setManualModal(false); setSubmitStatus(null); }}
                    className="flex-1 border py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
                    Annuler
                  </button>
                  <button onClick={submitManual} disabled={submitStatus === "loading"}
                    className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                    {submitStatus === "loading" ? "Envoi…" : "Confirmer le paiement"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-8">
        Paiement manuel : envoyez votre reçu à <strong>pay@glink.mg</strong> — activation sous 24h ouvrées.
      </p>
    </div>
  );
}