import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const IconBolt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
    style={{ filter: "drop-shadow(0 0 5px #FFD93D)" }}>
    <defs>
      <linearGradient id="boltNav" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE566" />
        <stop offset="100%" stopColor="#FF9500" />
      </linearGradient>
    </defs>
    <path d="M14.5 2.5L5 13.5h6.5L9.5 21.5l9.5-11h-6.5L14.5 2.5z"
      fill="url(#boltNav)" stroke="#CC7000" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const IconLink    = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101"/><path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656L13.07 5.07"/></svg>;
const IconMenu    = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>;
const IconClose   = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IconChevron = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>;
const IconDash    = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconAdmin   = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconLogout  = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"/></svg>;

const PLAN_COLOR = {
  FREE:     "bg-gray-100 text-gray-600",
  PRO:      "bg-indigo-100 text-indigo-700",
  BUSINESS: "bg-purple-100 text-purple-700",
};

// ─── Avatar initiales ─────────────────────────────────────────────────────────
function Avatar({ email }) {
  const initials = email?.slice(0, 2).toUpperCase() ?? "??";
  return (
    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────
function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Fermer si clic dehors
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 border rounded-xl px-2.5 py-1.5 hover:bg-gray-50 transition-all">
        <Avatar email={user.email} />
        <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden lg:block">
          {user.email}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full hidden lg:block ${PLAN_COLOR[user.plan]}`}>
          {user.plan}
        </span>
        <span className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <IconChevron />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-56 bg-white border rounded-2xl shadow-lg py-1.5 z-50">

          {/* Info utilisateur */}
          <div className="px-4 py-3 border-b">
            <p className="text-xs font-semibold text-gray-800 truncate">{user.email}</p>
            <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_COLOR[user.plan]}`}>
              {user.plan}
            </span>
          </div>

          {/* Liens */}
          <div className="py-1.5">
            <Link to="/dashboard" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
              <IconDash /> Mes liens
            </Link>
            {user.isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                <IconAdmin /> Panel Admin
              </Link>
            )}
            {user.plan === "FREE" && (
              <Link to="/pricing" onClick={() => setOpen(false)}
                className="flex items-center gap-2 mx-3 my-1.5 justify-center text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-xl">
                <IconBolt /> Passer Pro
              </Link>
            )}
          </div>

          {/* Déconnexion */}
          <div className="border-t pt-1.5 pb-1">
            <button onClick={() => { setOpen(false); onLogout(); }}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
              <IconLogout /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); nav("/login"); setOpen(false); };
  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 md:px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" onClick={close} className="flex items-center gap-1.5 border rounded-xl px-2.5 py-1.5 hover:bg-gray-50 transition-all">
          <span className="text-black"><IconLink /></span>
          <span className="font-bold text-lg tracking-tight">
            glink<span className="text-indigo-500">.mg</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/pricing" className="text-sm text-gray-500 hover:text-black transition-colors">
            Tarifs
          </Link>
          {user ? (
            <UserDropdown user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                Connexion
              </Link>
              <Link to="/register"
                className="text-sm bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button onClick={() => setOpen(o => !o)}
          className="md:hidden p-1 rounded-lg hover:bg-gray-100">
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-3">
          <Link to="/pricing" onClick={close}
            className="text-sm text-gray-600 py-2 border-b">Tarifs</Link>

          {user ? (
            <>
              {/* Info user mobile */}
              <div className="flex items-center gap-3 py-2 border-b">
                <Avatar email={user.email} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_COLOR[user.plan]}`}>
                    {user.plan}
                  </span>
                </div>
              </div>

              <Link to="/dashboard" onClick={close}
                className="flex items-center gap-2 text-sm text-gray-600 py-2">
                <IconDash /> Mes liens
              </Link>

              {user.isAdmin && (
                <Link to="/admin" onClick={close}
                  className="flex items-center gap-2 text-sm text-gray-600 py-2 border-b">
                  <IconAdmin /> Panel Admin
                </Link>
              )}

              {user.plan === "FREE" && (
                <Link to="/pricing" onClick={close}
                  className="flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl">
                  <IconBolt /> Passer Pro
                </Link>
              )}

              <button onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-left text-red-400 hover:text-red-600 py-2">
                <IconLogout /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close}
                className="text-sm text-gray-600 py-2 border-b">Connexion</Link>
              <Link to="/register" onClick={close}
                className="text-sm bg-black text-white px-4 py-2.5 rounded-xl text-center font-medium">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}