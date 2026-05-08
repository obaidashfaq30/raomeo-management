import { LogOut, Menu, Search } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="glass-panel sticky top-0 z-20 flex h-20 items-center justify-between border-x-0 border-t-0 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/60 text-slate-600 shadow-sm lg:hidden" aria-label="Menu">
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
          <input
            className="field-glass w-72 pl-10"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-ink">{user?.name || "Raomeo User"}</p>
          <p className="text-xs capitalize text-slate-500">{String(user?.role || "staff").replace(/_/g, " ")}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-harbor text-sm font-bold text-white shadow-glow">
          {(user?.name || "R").slice(0, 1)}
        </div>
        <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/60 text-slate-600 shadow-sm transition hover:bg-white" aria-label="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
