export const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

export const AUTH_URL = `${API_URL}/auth`;
export const VOLUNTEERS_URL = `${API_URL}/volunteers`;
export const DISASTERS_URL = `${API_URL}/disasters`;
export const SHELTERS_URL = `${API_URL}/shelters`;
export const ASSIGNMENTS_URL = `${API_URL}/assignments`;

export const authHeaders = () => {
  return {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };
};