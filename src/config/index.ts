export const config = {
  baseUrl:
    import.meta.env.VITE_MODE === "sandbox"
      ? import.meta.env.VITE_API_BASE_URL ||
        "https://veranotalk-backend.onrender.com"
      : "https://f6c2922c6801.ngrok-free.app",
};
