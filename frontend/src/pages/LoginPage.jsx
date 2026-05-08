import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Hotel, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { token, login, loading, error } = useAuthStore();
  const [form, setForm] = useState({ email: "admin@raomeo.test", password: "password123" });
  const [validation, setValidation] = useState({});

  if (token) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    const nextValidation = {};
    if (!form.email.includes("@")) nextValidation.email = "Valid email required";
    if (form.password.length < 8) nextValidation.password = "Minimum 8 characters";
    setValidation(nextValidation);
    if (Object.keys(nextValidation).length > 0) return;
    if (await login(form.email, form.password)) navigate("/dashboard");
  };

  return (
    <div className="app-background grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,118,110,0.74),rgba(23,32,42,0.82)),url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <Hotel size={26} />
            </div>
            <div>
              <p className="text-xl font-semibold">Raomeo Management</p>
              <p className="text-sm text-white/70">Hotel operations suite</p>
            </div>
          </div>
          <div className="glass-dark max-w-xl rounded-2xl p-6">
            <span className="eyebrow-pill border-white/20 bg-white/10 text-white">Front desk ready</span>
            <h1 className="mt-5 text-5xl font-bold leading-tight">Run every stay from one calm command center.</h1>
            <p className="mt-5 text-lg text-white/75">Reservations, rooms, service, billing, and reporting move together.</p>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <form onSubmit={submit} className="glass-panel-strong w-full max-w-md rounded-2xl p-6">
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-harbor text-white shadow-glow lg:hidden">
              <Hotel size={24} />
            </div>
            <span className="eyebrow-pill mb-4">Secure staff access</span>
            <h2 className="text-3xl font-bold text-ink">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">admin@raomeo.test / password123</p>
          </div>
          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <span className="relative block">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                className="field-glass pl-10"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </span>
            {validation.email && <span className="mt-1 block text-xs text-coral">{validation.email}</span>}
          </label>
          <label className="mb-6 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <span className="relative block">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                className="field-glass pl-10"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </span>
            {validation.password && <span className="mt-1 block text-xs text-coral">{validation.password}</span>}
          </label>
          {error && <p className="mb-4 rounded-xl bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">{error}</p>}
          <button className="btn-primary h-11 w-full" disabled={loading}>
            {loading ? "Signing in" : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
