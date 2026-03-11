import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { linksAPI } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const PLAN_LIMITS = { FREE: 10, PRO: 500, BUSINESS: "∞" };
const PAGE_SIZE = 10;

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconCopy     = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const IconCheck    = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const IconTrash    = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconPause    = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IconPlay     = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconClick    = () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6 6m0 0l-3-3m3 3V9a3 3 0 0 1 6 0v3"/></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
const IconLimit    = () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>;
const IconLink     = () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101"/><path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656L13.07 5.07"/></svg>;
const IconBolt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    style={{ filter: "drop-shadow(0 0 3px #FFD93D)" }}>
    <defs>
      <linearGradient id="boltDash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE566" />
        <stop offset="100%" stopColor="#FF9500" />
      </linearGradient>
    </defs>
    <path d="M14.5 2.5L5 13.5h6.5L9.5 21.5l9.5-11h-6.5L14.5 2.5z"
      fill="url(#boltDash)" stroke="#CC7000" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);
const IconPlus     = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/></svg>;
const IconUpload   = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>;
const IconList     = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>;
const IconGrid     = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconQr       = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path strokeLinecap="round" d="M14 14h3v3h-3zm3 3h3v3h-3zm0-3h3"/></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;
const IconShare    = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path strokeLinecap="round" d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>;
const IconClose2   = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IconSlug     = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>;

// ─── QR Code Modal ────────────────────────────────────────────────────────────
function QrModal({ link, onClose }) {
  const [qrUrl, setQrUrl]     = useState(null);
  const [loading, setLoading] = useState(true);
  const short = `http://localhost:3000/${link.slug}`;

  // Charger qrcode lib dynamiquement
  useEffect(() => {
    const load = async () => {
      if (!window.QRCode) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const div = document.createElement("div");
      new window.QRCode(div, {
        text:   short,
        width:  256,
        height: 256,
        colorDark:  "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H,
      });
      setTimeout(() => {
        const img = div.querySelector("img") || div.querySelector("canvas");
        const url = img?.src || (img?.tagName === "CANVAS" ? img.toDataURL("image/png") : null);
        setQrUrl(url);
        setLoading(false);
      }, 300);
    };
    load().catch(console.error);
  }, [short]);

  const download = () => {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `qr-${link.slug}.png`;
    a.click();
  };

  const SOCIALS = [
    { label: "WhatsApp",  color: "#25D366", icon: "💬", url: `https://wa.me/?text=${encodeURIComponent("Voici mon lien court : " + short)}` },
    { label: "Facebook",  color: "#1877F2", icon: "📘", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(short)}` },
    { label: "Twitter/X", color: "#000000", icon: "✖", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(short)}&text=${encodeURIComponent("Découvrez ce lien :")}` },
    { label: "Telegram",  color: "#229ED9", icon: "✈️", url: `https://t.me/share/url?url=${encodeURIComponent(short)}&text=${encodeURIComponent("Voici mon lien court :")}` },
    { label: "Email",     color: "#6B7280", icon: "📧", url: `mailto:?subject=Lien%20court&body=${encodeURIComponent("Voici mon lien court : " + short)}` },
    { label: "Google",    color: "#EA4335", icon: "🔍", url: `https://www.google.com/search?q=${encodeURIComponent(short)}` },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base">QR Code</h3>
            <p className="text-xs text-indigo-500 font-mono">glink.mg/{link.slug}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <IconClose2 />
          </button>
        </div>

        {/* QR Preview */}
        <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-6 mb-5 border">
          {loading
            ? <div className="w-[160px] h-[160px] flex items-center justify-center text-gray-300 text-xs">Génération…</div>
            : qrUrl
            ? <img src={qrUrl} alt="QR Code" className="w-[160px] h-[160px] rounded-lg" />
            : <p className="text-red-400 text-xs">Erreur génération</p>
          }
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-5">
          <button onClick={download} disabled={!qrUrl}
            className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition-all">
            <IconDownload /> Télécharger PNG
          </button>
        </div>

        {/* Partage réseaux sociaux */}
        <div>
          <p className="text-xs text-gray-400 font-medium mb-3">Partager le lien</p>
          <div className="grid grid-cols-3 gap-2">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
                className="flex flex-col items-center gap-1.5 border rounded-xl py-2.5 px-1 hover:bg-gray-50 transition-all group">
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs text-gray-500 group-hover:text-gray-800">{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* URL copiable */}
        <div className="mt-4 flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2">
          <span className="text-xs text-gray-500 truncate flex-1 font-mono">{short}</span>
          <button onClick={() => navigator.clipboard.writeText(short)}
            className="text-xs text-indigo-500 hover:text-indigo-700 shrink-0 font-medium">
            Copier
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Import limits per plan ───────────────────────────────────────────────────
const IMPORT_LIMITS = { FREE: 0, PRO: 50, BUSINESS: 500 };

// ─── Universal file parser ────────────────────────────────────────────────────
async function parseImportFile(file) {
  // Excel : utiliser SheetJS via CDN dynamique
  if (file.name.match(/\.xlsx?$/i)) {
    return parseExcel(file);
  }
  const text = await file.text();
  return parseDelimited(text);
}

function detectDelimiter(text) {
  const sample = text.split("\n").slice(0, 5).join("\n");
  const counts = {
    ",": (sample.match(/,/g) || []).length,
    ";": (sample.match(/;/g) || []).length,
    "\t": (sample.match(/\t/g) || []).length,
  };
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function parseDelimited(text) {
  const delim   = detectDelimiter(text);
  const lines   = text.trim().split(/\r?\n/);
  const headers = lines[0].split(delim).map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());

  const urlIdx  = headers.findIndex(h => h === "url"  || h === "lien" || h === "link");
  const slugIdx = headers.findIndex(h => h === "slug" || h === "alias"|| h === "custom");

  const rows = [];
  const errs = [];

  lines.slice(1).forEach((line, i) => {
    if (!line.trim()) return;
    const cols = line.split(delim).map(c => c.trim().replace(/^"|"$/g, ""));
    const url  = urlIdx  >= 0 ? cols[urlIdx]  : cols[0];
    const slug = slugIdx >= 0 ? cols[slugIdx] : cols[1];
    if (!url || !url.startsWith("http")) {
      errs.push(`Ligne ${i + 2} : URL invalide "${url || "(vide)"}"`);
    } else {
      rows.push({ url, slug: slug || "" });
    }
  });

  return { rows, errs };
}

async function parseExcel(file) {
  // Charger SheetJS dynamiquement si pas encore chargé
  if (!window.XLSX) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const buf  = await file.arrayBuffer();
  const wb   = window.XLSX.read(buf, { type: "array" });
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const data = window.XLSX.utils.sheet_to_json(ws, { defval: "" });

  const rows = [];
  const errs = [];

  data.forEach((row, i) => {
    const keys = Object.keys(row).map(k => k.toLowerCase());
    const urlKey  = Object.keys(row).find(k => ["url","lien","link"].includes(k.toLowerCase()));
    const slugKey = Object.keys(row).find(k => ["slug","alias","custom"].includes(k.toLowerCase()));
    const url  = urlKey  ? String(row[urlKey]).trim()  : String(Object.values(row)[0]).trim();
    const slug = slugKey ? String(row[slugKey]).trim() : String(Object.values(row)[1] || "").trim();

    if (!url || !url.startsWith("http")) {
      errs.push(`Ligne ${i + 2} : URL invalide "${url || "(vide)"}"`);
    } else {
      rows.push({ url, slug });
    }
  });

  return { rows, errs };
}

// ─── LinkCard List ────────────────────────────────────────────────────────────
function LinkCardList({ link, onDelete, onToggle, onQr }) {
  const [copied, setCopied] = useState(false);
  const short = `http://localhost:3000/${link.slug}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(short); }
    catch { const el = document.createElement("input"); el.value = short; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-2 ${link.expired ? "opacity-60 bg-gray-50" : "bg-white"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <a href={short} target="_blank" rel="noreferrer"
            className="font-mono text-indigo-600 text-sm font-semibold hover:underline">
            glink.mg/{link.slug}
          </a>
          <p className="text-xs text-gray-400 truncate mt-0.5">{link.url}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {link.expired && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Expiré</span>}
          {!link.expired && !link.isActive && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Désactivé</span>}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><IconClick /> {link.clicks} clics</span>
        {link.expiresAt && <span className="flex items-center gap-1"><IconCalendar /> {new Date(link.expiresAt).toLocaleDateString("fr-MG")}</span>}
        {link.maxClicks && <span className="flex items-center gap-1"><IconLimit /> Max {link.maxClicks}</span>}
      </div>
      {link.expiryReason && <p className="text-xs text-red-500">Raison : {link.expiryReason}</p>}
      <div className="flex gap-2 mt-1">
        <button onClick={copy} className={`flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg transition-all ${copied ? "border-green-400 text-green-600 bg-green-50" : "hover:bg-gray-50"}`}>
          {copied ? <IconCheck /> : <IconCopy />} {copied ? "Copié !" : "Copier"}
        </button>
        <button onClick={() => onQr(link)} className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg hover:bg-gray-50">
          <IconQr /> QR
        </button>
        <button onClick={() => onToggle(link)} className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg hover:bg-gray-50">
          {link.isActive ? <IconPause /> : <IconPlay />} {link.isActive ? "Désactiver" : "Réactiver"}
        </button>
        <button onClick={() => onDelete(link.id)} className="flex items-center gap-1.5 text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 ml-auto">
          <IconTrash /> Supprimer
        </button>
      </div>
    </div>
  );
}

// ─── LinkCard Grid ────────────────────────────────────────────────────────────
function LinkCardGrid({ link, onDelete, onToggle, onQr }) {
  const [copied, setCopied] = useState(false);
  const short = `http://localhost:3000/${link.slug}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(short); }
    catch { const el = document.createElement("input"); el.value = short; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-3 ${link.expired ? "opacity-60 bg-gray-50" : "bg-white"}`}>
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">#{link.id}</span>
        {link.expired
          ? <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Expiré</span>
          : !link.isActive
          ? <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Désactivé</span>
          : <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Actif</span>
        }
      </div>
      {/* Slug */}
      <div>
        <a href={short} target="_blank" rel="noreferrer"
          className="font-mono text-indigo-600 text-sm font-bold hover:underline block truncate">
          /{link.slug}
        </a>
        <p className="text-xs text-gray-400 truncate mt-0.5">{link.url}</p>
      </div>
      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><IconClick /> {link.clicks}</span>
        {link.expiresAt && <span className="flex items-center gap-1"><IconCalendar /> {new Date(link.expiresAt).toLocaleDateString("fr-MG")}</span>}
      </div>
      {/* Actions */}
      <div className="flex gap-1.5 mt-auto pt-1 border-t">
        <button onClick={copy} className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg border transition-all ${copied ? "border-green-400 text-green-600 bg-green-50" : "hover:bg-gray-50"}`}>
          {copied ? <IconCheck /> : <IconCopy />} {copied ? "Copié" : "Copier"}
        </button>
        <button onClick={() => onQr(link)} className="flex items-center justify-center border px-2.5 py-1.5 rounded-lg hover:bg-gray-50">
          <IconQr />
        </button>
        <button onClick={() => onToggle(link)} className="flex items-center justify-center border px-2.5 py-1.5 rounded-lg hover:bg-gray-50">
          {link.isActive ? <IconPause /> : <IconPlay />}
        </button>
        <button onClick={() => onDelete(link.id)} className="flex items-center justify-center border border-red-200 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50">
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

// ─── Import Modal ─────────────────────────────────────────────────────────────
function ImportModal({ onClose, onImported, plan }) {
  const [step, setStep]           = useState("upload");
  const [rows, setRows]           = useState([]);
  const [errors, setErrors]       = useState([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults]     = useState({ ok: 0, fail: 0 });
  const [fileName, setFileName]   = useState("");
  const [dragging, setDragging]   = useState(false);
  const fileRef = useRef();
  const limit = IMPORT_LIMITS[plan];

  const ACCEPTED = ".csv,.tsv,.txt,.xls,.xlsx";
  const FORMAT_LABELS = ["CSV (,)", "CSV (;)", "CSV (tab)", "TXT (,)", "TXT (tab)", "Excel (.xls, .xlsx)"];

  const processFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    try {
      const { rows: parsed, errs } = await parseImportFile(file);
      const limited = parsed.slice(0, limit);
      setRows(limited);
      setErrors([
        ...errs,
        ...(parsed.length > limit
          ? [`⚠️ Limité à ${limit} liens (plan ${plan}). ${parsed.length - limit} ligne(s) ignorée(s).`]
          : []),
      ]);
      setStep("preview");
    } catch (e) {
      setErrors([`Erreur de lecture : ${e.message}`]);
    }
  };

  const handleFile    = (e) => processFile(e.target.files[0]);
  const handleDrop    = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const runImport = async () => {
    setImporting(true);
    let ok = 0, fail = 0;
    for (const row of rows) {
      try {
        await linksAPI.create({ url: row.url, customSlug: row.slug || undefined });
        ok++;
      } catch { fail++; }
    }
    setResults({ ok, fail });
    setStep("done");
    setImporting(false);
    onImported();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-7 max-w-lg w-full shadow-xl">

        {step === "upload" && (
          <>
            <h3 className="text-lg font-bold mb-1">Importer des liens</h3>
            <p className="text-sm text-gray-400 mb-4">Max <strong>{limit} lignes</strong> — plan {plan}</p>

            {/* Formats supportés */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {FORMAT_LABELS.map(f => (
                <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{f}</span>
              ))}
            </div>

            {/* Drop zone */}
            <input type="file" accept={ACCEPTED} ref={fileRef} onChange={handleFile} className="hidden" />
            <div
              onClick={() => fileRef.current.click()}
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              className={`w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-10 cursor-pointer transition-all ${
                dragging ? "border-indigo-400 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
              }`}>
              <IconUpload />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Glissez votre fichier ici</p>
                <p className="text-xs text-gray-400 mt-1">ou cliquez pour parcourir</p>
              </div>
            </div>

            {/* Colonnes attendues */}
            <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">Colonnes reconnues :</p>
              <p><code className="bg-white px-1 rounded border">url</code> ou <code className="bg-white px-1 rounded border">lien</code> ou <code className="bg-white px-1 rounded border">link</code> — <strong>obligatoire</strong></p>
              <p><code className="bg-white px-1 rounded border">slug</code> ou <code className="bg-white px-1 rounded border">alias</code> — optionnel</p>
            </div>

            {/* Template */}
            <a href="data:text/csv;charset=utf-8,url,slug%0Ahttps://example.com,mon-slug%0Ahttps://google.com,"
              download="template-glink.csv"
              className="text-xs text-indigo-500 hover:underline block mt-3">
              ↓ Télécharger le template CSV
            </a>

            {errors.length > 0 && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
                {errors.map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
              </div>
            )}

            <button onClick={onClose} className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600">Annuler</button>
          </>
        )}

        {step === "preview" && (
          <>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold">Aperçu</h3>
              <span className="text-xs text-gray-400 font-mono truncate max-w-[180px]">{fileName}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{rows.length} lien(s) à importer</p>

            {errors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 space-y-1 max-h-24 overflow-y-auto">
                {errors.map((e, i) => <p key={i} className="text-xs text-yellow-700">{e}</p>)}
              </div>
            )}

            <div className="max-h-52 overflow-y-auto border rounded-xl divide-y mb-5">
              {rows.map((r, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 text-xs">
                  <span className="text-gray-300 w-5 shrink-0 text-right">{i + 1}</span>
                  <span className="truncate flex-1 text-gray-700">{r.url}</span>
                  {r.slug && <span className="font-mono text-indigo-500 shrink-0">/{r.slug}</span>}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setStep("upload"); setErrors([]); }} className="flex-1 border py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">← Retour</button>
              <button onClick={runImport} disabled={importing || rows.length === 0}
                className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                {importing ? "Import en cours…" : `Importer ${rows.length} liens`}
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">{results.fail === 0 ? "✅" : "⚠️"}</div>
            <h3 className="text-xl font-bold mb-2">Import terminé</h3>
            <p className="text-sm text-gray-500 mb-1"><span className="text-green-600 font-bold">{results.ok}</span> liens importés avec succès</p>
            {results.fail > 0 && <p className="text-sm text-red-500">{results.fail} échec(s) — slug déjà utilisé ou URL invalide</p>}
            <button onClick={onClose} className="mt-6 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium">Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, total, pageSize, onChange }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-gray-400">{from}–{to} sur {total}</span>
      <div className="flex gap-1">
        <button onClick={() => onChange(1)} disabled={page === 1}
          className="px-2.5 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50">«</button>
        <button onClick={() => onChange(page - 1)} disabled={page === 1}
          className="px-2.5 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50">‹</button>
        {Array.from({ length: pages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1)
          .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) => p === "…"
            ? <span key={`e${i}`} className="px-2 py-1 text-xs text-gray-400">…</span>
            : <button key={p} onClick={() => onChange(p)}
                className={`px-2.5 py-1 border rounded-lg text-xs ${p === page ? "bg-black text-white border-black" : "hover:bg-gray-50"}`}>
                {p}
              </button>
          )}
        <button onClick={() => onChange(page + 1)} disabled={page === pages}
          className="px-2.5 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50">›</button>
        <button onClick={() => onChange(pages)} disabled={page === pages}
          className="px-2.5 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50">»</button>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [links, setLinks]       = useState([]);
  const [form, setForm]         = useState({ url: "", slug: "", expiresAt: "", maxClicks: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [view, setView]         = useState("list");       // "list" | "grid"
  const [tab, setTab]           = useState("active");     // "active" | "expired"
  const [page, setPage]         = useState(1);
  const [showImport, setShowImport] = useState(false);
  const [qrLink, setQrLink]     = useState(null); // ← AJOUT : lien sélectionné pour le QR

  const isPro   = user?.plan === "PRO" || user?.plan === "BUSINESS";
  const isFree  = user?.plan === "FREE";
  const canImport = IMPORT_LIMITS[user?.plan] > 0;

  const load = () => linksAPI.list().then(setLinks).catch(console.error);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const create = async () => {
    setError(""); setLoading(true);
    try {
      await linksAPI.create({
        url: form.url,
        customSlug: form.slug      || undefined,
        expiresAt:  form.expiresAt || undefined,
        maxClicks:  form.maxClicks ? Number(form.maxClicks) : undefined,
      });
      setForm({ url: "", slug: "", expiresAt: "", maxClicks: "" });
      load();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const del    = async (id) => { await linksAPI.remove(id); load(); };
  const toggle = async (l)  => { await linksAPI.update(l.id, { isActive: !l.isActive }); load(); };

  const active  = links.filter(l =>  l.isActive && !l.expired);
  const expired = links.filter(l => !l.isActive ||  l.expired);
  const current = tab === "active" ? active : expired;
  const paginated = current.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const limit = PLAN_LIMITS[user?.plan];

  const LinkCard = view === "grid" ? LinkCardGrid : LinkCardList;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes liens</h1>
          <p className="text-sm text-gray-400 mt-0.5">{active.length} / {limit} liens actifs</p>
        </div>
        {!isPro && (
          <Link to="/pricing"
            className="flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-sm transition-all">
            <span className="text-yellow-300"><IconBolt /></span> Passer Pro
          </Link>
        )}
      </div>

      {/* Bannière FREE */}
      {isFree && (
        <div className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2">
          <IconLimit />
          Plan gratuit : liens expirés après <strong>3 jours</strong>.{" "}
          <Link to="/pricing" className="underline font-semibold ml-1">Passer Pro</Link> pour des liens permanents.
        </div>
      )}

      {/* Formulaire création */}
      <div className="bg-white border rounded-2xl p-5 mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-gray-700">Créer un short link</h2>
          {/* Import CSV */}
          {canImport ? (
            <button onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600">
              <IconUpload /> Importer CSV
            </button>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg text-gray-300 cursor-not-allowed">
                <IconUpload /> Importer CSV <IconLock />
              </button>
              <div className="absolute right-0 top-8 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 w-48 hidden group-hover:block z-10">
                Import CSV disponible à partir du plan Pro
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input value={form.url} onChange={set("url")}
          placeholder="https://votre-url-longue.com"
          className="w-full border rounded-xl px-4 py-2.5 text-sm" />

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSlug /></span>
          <input value={form.slug} onChange={set("slug")}
            placeholder={isPro ? "Slug personnalisé (optionnel)" : "Slug personnalisé — Pro uniquement"}
            disabled={!isPro}
            className="w-full border rounded-xl pl-9 pr-9 py-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-400" />
          {!isPro && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"><IconLock /></span>
          )}
        </div>

        {isPro && (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Expire le (date)</label>
              <input type="datetime-local" value={form.expiresAt} onChange={set("expiresAt")}
                className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Expire après (clics)</label>
              <input type="number" value={form.maxClicks} onChange={set("maxClicks")}
                placeholder="ex: 100"
                className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
          </div>
        )}

        <button onClick={create} disabled={loading || !form.url}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
          <IconPlus /> {loading ? "Création…" : "Créer le lien"}
        </button>
      </div>

      {/* Toolbar : tabs + vue */}
      <div className="flex items-center justify-between mb-4">
        {/* Tabs actifs / expirés */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button onClick={() => { setTab("active"); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === "active" ? "bg-white shadow-sm text-black" : "text-gray-500"}`}>
            Actifs <span className="ml-1 text-xs">({active.length})</span>
          </button>
          <button onClick={() => { setTab("expired"); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === "expired" ? "bg-white shadow-sm text-black" : "text-gray-500"}`}>
            Expirés <span className="ml-1 text-xs">({expired.length})</span>
          </button>
        </div>

        {/* Toggle vue */}
        <div className="flex gap-1 border rounded-xl p-1">
          <button onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}>
            <IconList />
          </button>
          <button onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}>
            <IconGrid />
          </button>
        </div>
      </div>

      {/* Liste / Grid */}
      {paginated.length > 0 ? (
        <>
          <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-3" : "space-y-3"}>
            {paginated.map(l => (
              <LinkCard key={l.id} link={l} onDelete={del} onToggle={toggle} onQr={setQrLink} />
            ))}
          </div>
          <Pagination page={page} total={current.length} pageSize={PAGE_SIZE} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      ) : (
        <div className="text-center text-gray-300 py-20">
          <div className="flex justify-center mb-4"><IconLink /></div>
          <p className="text-gray-400">
            {tab === "active" ? "Aucun lien actif. Créez votre premier !" : "Aucun lien expiré."}
          </p>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <ImportModal
          plan={user?.plan}
          onClose={() => setShowImport(false)}
          onImported={() => { load(); }}
        />
      )}

      {/* QR Modal ← AJOUT */}
      {qrLink && (
        <QrModal link={qrLink} onClose={() => setQrLink(null)} />
      )}
    </div>
  );
}