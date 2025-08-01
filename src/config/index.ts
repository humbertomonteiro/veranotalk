export const config = {
  baseUrl:
    import.meta.env.VITE_MODE === "production"
      ? import.meta.env.VITE_API_BASE_URL ||
        "https://veranotalk-backend.onrender.com"
      : "https://cdfa56c926bf.ngrok-free.app",
};
