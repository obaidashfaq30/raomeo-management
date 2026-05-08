/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#17202a",
        harbor: "#0f766e",
        coral: "#e76f51",
        saffron: "#f4a261",
        mist: "#eef4f2",
        lagoon: "#2563eb",
        graphite: "#334155"
      },
      boxShadow: {
        panel: "0 10px 30px rgba(23, 32, 42, 0.08)",
        glass: "0 24px 70px rgba(23, 32, 42, 0.11)",
        glow: "0 18px 34px rgba(15, 118, 110, 0.28)"
      }
    }
  },
  plugins: []
};
