import { useEffect, useState } from "react";
import { usersApi } from "../api/users.api";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setUsers(await usersApi.list());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    users,
    error,
    reload: load,
    ...usersApi,
  };
}
