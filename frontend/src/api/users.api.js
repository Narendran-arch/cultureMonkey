import { API } from "./api";

export const getUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const getUser = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await API.post("/users", data);
  return res.data;
};

export const deactivateUser = async (id) => {
  const res = await API.patch(`/users/${id}/deactivate`);
  return res.data;
};

export const activateUser = async (id) => {
  const res = await API.patch(`/users/${id}/activation`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};

export const migrateUser = async (id, company_id) => {
  const res = await API.patch(`/users/${id}/migrate`, { company_id });
  return res.data;
};
