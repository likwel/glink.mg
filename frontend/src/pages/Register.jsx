import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError("");
    try {
      await register(form.email, form.password, form.name);
      nav("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-3">
          <input value={form.name}     onChange={set("name")}
            placeholder="Nom complet"
            className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <input value={form.email}    onChange={set("email")}
            type="email" placeholder="Email"
            className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <input value={form.password} onChange={set("password")}
            type="password" placeholder="Mot de passe"
            className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <button onClick={submit}
            className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium">
            Créer mon compte
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
          Déjà un compte ? <Link to="/login" className="text-black font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}