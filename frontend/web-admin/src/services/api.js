export const API_URL ="https://disaster-volunteer-backend-118865344431.asia-southeast2.run.app/api";

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