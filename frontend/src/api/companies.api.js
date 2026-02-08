import { API } from "./api";

export const getCompanies = () => API.get("/companies");
export const getCompany = id => API.get(`/companies/${id}`);
export const createCompany = data => API.post("/companies", data);
export const deleteCompany = id => API.delete(`/companies/${id}`);
export const updateCompany = (id,data) => API.put(`/companies/${id}`,data)
export const addUserToCompany = (id, data) =>
  API.post(`/companies/${id}/users`, data);
export const removeUserFromCompany = (cid, uid) =>
  API.patch(`/companies/${cid}/users/${uid}`);
