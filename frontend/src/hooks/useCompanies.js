import { useEffect, useState } from "react";
import { companiesApi } from "../api/companies.api";

export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setCompanies(await companiesApi.list());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load().then(() => {
    });
  }, []);

  return {
    companies,
    error,
    reload: load,
    create: companiesApi.create,
    update: companiesApi.update,
    remove: companiesApi.remove,
  };
}
