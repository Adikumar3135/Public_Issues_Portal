import api from "./api";
export const createComplaint = async (data) => (await api.post("/complaints", {
  title: data.title, description: data.description, category: data.category,
  address: data.address ?? data.location, ...(data.latitude != null ? { latitude: Number(data.latitude) } : {}),
  ...(data.longitude != null ? { longitude: Number(data.longitude) } : {}),
})).data;
export const getMyComplaints = async (params = {}) => (await api.get("/complaints/my", { params })).data;
export const getComplaintById = async (id) => (await api.get(`/complaints/my/${id}`)).data;
export const updateMyComplaint = async (id, data) => (await api.patch(`/complaints/my/${id}`, data)).data;
export const getReviewComplaints = async (params = {}) => (await api.get("/complaints/admin/review", { params })).data;
export const startReview = async (id) => (await api.patch(`/complaints/admin/${id}/review`)).data;
export const approveComplaint = async (id, data) => (await api.patch(`/complaints/admin/${id}/approve`, data)).data;
export const rejectComplaint = async (id, reason) => (await api.patch(`/complaints/admin/${id}/reject`, { reason })).data;
export const assignComplaint = async (id, staffId) => (await api.patch(`/complaints/admin/${id}/assign`, { staffId })).data;
export const getAssignedComplaints = async (params = {}) => (await api.get("/complaints/staff/assigned", { params })).data;
export const getStaffComplaint = async (id) => (await api.get(`/complaints/staff/${id}`)).data;
export const updateStaffComplaint = async (id, data) => (await api.patch(`/complaints/staff/${id}/status`, data)).data;
