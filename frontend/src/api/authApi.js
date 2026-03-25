import { api } from "./axios";

export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
