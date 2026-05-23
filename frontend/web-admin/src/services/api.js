export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Tetap disediakan agar komponen lama tidak perlu banyak diubah.
// Setelah service digabung, semua URL diarahkan ke backend yang sama.
export const AUTH_URL = API_URL;
export const VOL_URL = API_URL;
export const DIS_URL = API_URL;

export const authHeaders = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };
};
