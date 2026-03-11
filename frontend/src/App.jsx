import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Navbar    from "./components/Navbar.jsx";
import Login     from "./pages/Login.jsx";
import Register  from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Pricing   from "./pages/Pricing.jsx";
import Admin     from "./pages/Admin.jsx";
import Landing from "./pages/Landing.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Chargement…</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.isAdmin ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Landing  />} />
          <Route path="/login"    element={<PublicRoute><Login    /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/pricing"  element={<Pricing />} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/admin"    element={<AdminOnly><Admin /></AdminOnly>} />
          <Route path="*"         element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}