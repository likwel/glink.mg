import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async () => {
    setError("");
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-3">
          <input value={email}    onChange={e => setEmail(e.target.value)}
            type="email" placeholder="Email"
            className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <input value={password} onChange={e => setPassword(e.target.value)}
            type="password" placeholder="Mot de passe"
            className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <button onClick={submit}
            className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium">
            Se connecter
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
          Pas de compte ? <Link to="/register" className="text-black font-medium">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}