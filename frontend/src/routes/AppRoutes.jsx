import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import BillingPage from "../pages/BillingPage.jsx";
import BookingCalendarPage from "../pages/BookingCalendarPage.jsx";
import CheckInOutPage from "../pages/CheckInOutPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import FoodBeveragePage from "../pages/FoodBeveragePage.jsx";
import FrontDeskPage from "../pages/FrontDeskPage.jsx";
import GuestsPage from "../pages/GuestsPage.jsx";
import HousekeepingPage from "../pages/HousekeepingPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import MaintenancePage from "../pages/MaintenancePage.jsx";
import ReportsPage from "../pages/ReportsPage.jsx";
import ReservationsPage from "../pages/ReservationsPage.jsx";
import RoomsPage from "../pages/RoomsPage.jsx";
import SearchPage from "../pages/SearchPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/calendar" element={<BookingCalendarPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/check-in-out" element={<CheckInOutPage />} />
          <Route path="/front-desk" element={<FrontDeskPage />} />
          <Route path="/housekeeping" element={<HousekeepingPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/food-beverage" element={<FoodBeveragePage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
