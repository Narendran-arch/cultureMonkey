import { API } from "./api";

export const getUsers = () => API.get("/users");
export const createUser = data => API.post("/users", data);
export const deactivateUser = id => API.patch(`/users/${id}/deactivate`);
export const deleteUser = id => API.delete(`/users/${id}`);
export const migrateUser = (id, company_id) =>
  API.patch(`/users/${id}/migrate`, { company_id });
export const updateUser = (id, data) =>
  API.put(`/users/${id}`, data);

