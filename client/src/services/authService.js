import api from "./api";
export const loginUser = async (data) => (await api.post("/auth/login", data)).data;
export const registerUser = async (data) => (await api.post("/auth/register", data)).data;
export const getProfile = async () => (await api.get("/auth/profile")).data;
export const createStaff = async (data) => (await api.post("/auth/staff", data)).data;
export const getStaff = async () => (await api.get("/auth/staff")).data;
export const deactivateStaff = async (id) => (await api.patch(`/auth/staff/${id}/deactivate`)).data;
