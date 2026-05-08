import { LogOut, Menu, Search } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden" aria-label="Menu">
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            className="h-10 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-harbor focus:bg-white"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-ink">{user?.name || "Raomeo User"}</p>
          <p className="text-xs capitalize text-slate-500">{String(user?.role || "staff").replaceAll("_", " ")}</p>
        </div>
        <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
