import {
  BedDouble,
  Bell,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Gauge,
  Hotel,
  Search,
  Settings2,
  Soup,
  UserRound,
  Wrench,
  BarChart3
} from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/rooms", label: "Rooms", icon: BedDouble },
  { to: "/reservations", label: "Reservations", icon: CalendarDays },
  { to: "/search", label: "ParetoSearch", icon: Search },
  { to: "/check-in-out", label: "Check-in/out", icon: ClipboardCheck },
  { to: "/front-desk", label: "Front Desk", icon: Bell },
  { to: "/housekeeping", label: "Housekeeping", icon: Settings2 },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/food-beverage", label: "F&B", icon: Soup },
  { to: "/guests", label: "Guests", icon: UserRound },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/reports", label: "Reports", icon: BarChart3 }
];

export default function Sidebar() {
  return (
    <aside className="glass-panel-strong sticky top-0 z-20 hidden h-screen w-72 shrink-0 border-r border-white/50 lg:block">
      <div className="flex h-20 items-center gap-3 border-b border-white/50 px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-harbor text-white shadow-glow">
          <Hotel size={22} />
        </div>
        <div>
          <p className="text-base font-bold text-ink">Raomeo</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-harbor">Management</p>
        </div>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-ink text-white shadow-lg shadow-slate-900/15"
                  : "text-slate-600 hover:bg-white/70 hover:text-ink"
              )
            }
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/55 text-current transition group-hover:bg-white/80">
              <Icon size={17} />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mx-4 mt-4 rounded-xl border border-white/60 bg-white/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-harbor">Today</p>
        <p className="mt-1 text-sm font-semibold text-ink">Operations desk is live</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">Rooms, billing, service, and staff activity stay connected from this workspace.</p>
      </div>
    </aside>
  );
}
