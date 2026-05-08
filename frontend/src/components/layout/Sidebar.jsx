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
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-harbor text-white">
          <Hotel size={22} />
        </div>
        <div>
          <p className="text-base font-semibold text-ink">Raomeo</p>
          <p className="text-xs font-medium text-slate-500">Management</p>
        </div>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive ? "bg-harbor text-white" : "text-slate-600 hover:bg-mist hover:text-ink"
              )
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
