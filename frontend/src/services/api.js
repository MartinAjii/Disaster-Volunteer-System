export const AUTH_URL = "http://localhost:3001";
export const VOL_URL = "http://localhost:3002";
export const DIS_URL = "http://localhost:3003";

export const authHeaders = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };
};