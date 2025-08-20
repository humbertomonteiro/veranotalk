export const config = {
  baseUrl:
    import.meta.env.VITE_MODE === "production"
      ? "https://veranotalk-backend.onrender.com"
      : // : "https://5ec35e0b56b0.ngrok-free.app",
        "http://localhost:4000",
};
