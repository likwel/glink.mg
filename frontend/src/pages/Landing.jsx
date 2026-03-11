import { useState } from "react";
import { Link } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconLink    = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101"/><path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656L13.07 5.07"/></svg>;
const IconZap     = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconShield  = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconChart   = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconQr      = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path strokeLinecap="round" d="M14 14h3v3h-3zm3 3h3v3h-3zm0-3h3"/></svg>;
const IconSlug    = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>;
const IconClock   = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IconChevron = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>;
const IconArrow   = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>;

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <IconZap />,    title: "Raccourcissement instantané",  desc: "Collez votre URL, obtenez un lien court en moins d'une seconde. Aucune friction." },
  { icon: <IconSlug />,   title: "Slugs personnalisés",          desc: "Choisissez votre propre alias : glink.mg/mon-promo au lieu d'une suite de caractères." },
  { icon: <IconChart />,  title: "Statistiques de clics",        desc: "Suivez en temps réel le nombre de clics sur chacun de vos liens." },
  { icon: <IconQr />,     title: "QR Code intégré",              desc: "Générez et téléchargez le QR code de n'importe quel lien en un clic." },
  { icon: <IconClock />,  title: "Expiration automatique",       desc: "Définissez une date limite ou un nombre de clics maximum pour vos liens." },
  { icon: <IconShield />, title: "Liens fiables & stables",      desc: "Vos liens restent actifs tant que vous le souhaitez. Aucune suppression surprise." },
];

const FAQS = [
  { q: "Glink.mg est-il gratuit ?", a: "Oui, le plan gratuit permet de créer jusqu'à 10 liens actifs. Les liens expirent après 3 jours. Pour des liens permanents et plus de fonctionnalités, passez au plan Pro." },
  { q: "Puis-je personnaliser mes liens ?", a: "Oui, avec le plan Pro vous pouvez choisir votre propre slug (ex: glink.mg/mon-lien) au lieu d'un code généré automatiquement." },
  { q: "Mes liens expirent-ils ?", a: "Sur le plan gratuit, les liens expirent après 3 jours. Sur les plans payants, vos liens sont permanents sauf si vous définissez vous-même une expiration." },
  { q: "Comment fonctionne le QR code ?", a: "Chaque lien possède un bouton QR dans le tableau de bord. Vous pouvez générer et télécharger le QR code en PNG, puis le partager sur vos réseaux." },
  { q: "Puis-je importer des liens en masse ?", a: "Oui, avec les plans Pro et Business vous pouvez importer un fichier CSV ou Excel contenant jusqu'à 500 URLs en une seule opération." },
  { q: "Quels moyens de paiement acceptez-vous ?", a: "Nous acceptons les cartes bancaires (Visa, Mastercard) via Stripe. Le paiement est sécurisé et les données ne transitent jamais sur nos serveurs." },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-b-0">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left text-sm font-medium text-gray-800 hover:text-black transition-colors">
        <span>{q}</span>
        <span className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <IconChevron />
        </span>
      </button>
      {open && <p className="pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>}
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Navbar ── */}
      {/* <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1 font-bold text-lg tracking-tight">
            <span className="text-black"><IconLink /></span>
            glink<span className="text-indigo-500">.mg</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="text-sm text-gray-500 hover:text-black">Tarifs</Link>
            <Link to="/login"
              className="text-sm text-gray-500 hover:text-black transition-colors px-3 py-1.5">
              Connexion
            </Link>
            <Link to="/register"
              className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
              Commencer
            </Link>
          </div>
        </div>
      </nav> */}

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-6">
          Raccourcisseur de liens · Madagascar
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Des liens courts.<br />
          <span className="text-indigo-500">Sans complication.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Transformez vos longues URLs en liens mémorables, suivez vos clics
          et partagez facilement — en quelques secondes.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/register"
            className="flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-sm">
            Créer un compte gratuit <IconArrow />
          </Link>
          <Link to="/login"
            className="text-sm font-medium text-gray-500 hover:text-black px-6 py-3 rounded-xl border hover:bg-gray-50 transition-all">
            Se connecter
          </Link>
        </div>

        {/* Demo pill */}
        <div className="mt-14 inline-flex items-center gap-3 bg-gray-50 border rounded-2xl px-5 py-3 text-sm">
          <span className="text-gray-400 font-mono truncate max-w-[200px] md:max-w-xs">
            https://www.example.com/une-url-tres-longue?param=value
          </span>
          <span className="text-gray-300">→</span>
          <span className="font-mono font-bold text-indigo-600">glink.mg/promo</span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 divide-x text-center">
          {[
            { value: "10x", label: "Plus court" },
            { value: "< 1s", label: "Génération" },
            { value: "100%", label: "Gratuit pour démarrer" },
          ].map(s => (
            <div key={s.label} className="px-4">
              <p className="text-2xl font-extrabold text-black">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Tout ce dont vous avez besoin</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Un outil simple, puissant et taillé pour le partage de liens au quotidien.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="border rounded-2xl p-6 hover:shadow-sm transition-shadow bg-white">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-black mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA intermédiaire ── */}
      <section className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Prêt à raccourcir vos liens ?</h2>
            <p className="text-gray-400 text-sm">Créez votre compte en 30 secondes. Aucune carte requise.</p>
          </div>
          <Link to="/register"
            className="shrink-0 flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all">
            Démarrer gratuitement <IconArrow />
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Questions fréquentes</h2>
          <p className="text-gray-400 text-sm">Tout ce que vous devez savoir avant de commencer.</p>
        </div>
        <div className="border rounded-2xl px-6 divide-y bg-white">
          {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1 font-bold text-gray-800">
            <IconLink />
            glink<span className="text-indigo-500">.mg</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="hover:text-black transition-colors">Tarifs</Link>
            <Link to="/login"   className="hover:text-black transition-colors">Connexion</Link>
            <Link to="/register" className="hover:text-black transition-colors">Inscription</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} glink.mg · Madagascar</p>
        </div>
      </footer>

    </div>
  );
}