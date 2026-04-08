import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const IconGoogle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function Register() {
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();

  const oauthError = params.get("error");
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      nav("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>

        {/* Erreur OAuth */}
        {oauthError && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {oauthError === "oauth_failed"
              ? "La connexion avec Google a échoué. Réessayez."
              : "Une erreur est survenue."}
          </p>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Bouton Google */}
        <button onClick={registerWithGoogle}
          className="w-full flex items-center justify-center gap-3 border rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all mb-4">
          <IconGoogle />
          Continuer avec Google
        </button>

        {/* Séparateur */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Formulaire classique */}
        <div className="space-y-3">
          <input value={form.name} onChange={set("name")}
            placeholder="Nom complet"
            className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <input value={form.email} onChange={set("email")}
            type="email" placeholder="Email"
            className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <input value={form.password} onChange={set("password")}
            type="password" placeholder="Mot de passe"
            onKeyDown={e => e.key === "Enter" && submit()}
            className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <button onClick={submit} disabled={loading || !form.email || !form.password}
            className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-black font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}