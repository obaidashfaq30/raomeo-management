import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = readStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("raomeo-auth");
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

function readStoredToken() {
  try {
    const raw = localStorage.getItem("raomeo-auth");
    return raw ? JSON.parse(raw)?.state?.token : null;
  } catch {
    return null;
  }
}

export const endpoints = {
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  dashboard: () => api.get("/front_desk/live_status"),
  reports: {
    occupancy: () => api.get("/reports/occupancy"),
    revenue: (params) => api.get("/reports/revenue", { params }),
    bookingTrends: (params) => api.get("/reports/booking_trends", { params })
  },
  rooms: (params) => api.get("/rooms", { params }),
  createRoom: (room) => api.post("/rooms", { room }),
  roomCategories: () => api.get("/room_categories"),
  reservations: (params) => api.get("/reservations", { params }),
  reservationCalendar: (params) => api.get("/reservations/calendar", { params }),
  createReservation: (reservation) => api.post("/reservations", { reservation }),
  guests: (params) => api.get("/guests", { params }),
  search: (params) => api.get("/pareto_search", { params }),
  housekeepingTasks: (params) => api.get("/housekeeping_tasks", { params }),
  maintenanceTickets: (params) => api.get("/maintenance_tickets", { params }),
  invoices: (params) => api.get("/invoices", { params }),
  foodBeverageOrders: (params) => api.get("/food_beverage_orders", { params })
};
