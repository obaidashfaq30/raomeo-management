import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function DashboardLayout() {
  return (
    <div className="app-background flex min-h-screen text-ink">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
