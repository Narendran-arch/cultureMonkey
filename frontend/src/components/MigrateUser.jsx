import { useEffect, useState } from "react";
import { getCompanies } from "../api/companies.api";
import { migrateUser } from "../api/users.api";

export default function MigrateUser({ userId, refresh }) {
  const [companies, setCompanies] = useState([]);
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompanies()
      .then((r) => setCompanies(r.data || []))
      .catch(console.error);
  }, []);

  const migrate = async () => {
    if (!target || loading) return;

    try {
      setLoading(true);
      await migrateUser(userId, Number(target));
      setTarget("");
      refresh?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end sm:w-full">
      <select
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="
          w-full sm:w-44
          px-3 py-2 text-sm
          rounded-lg border
          bg-white
          focus:ring-2 focus:ring-indigo-500
        "
        disabled={loading}
      >
        <option value="">Move to…</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        onClick={migrate}
        disabled={!target || loading}
        className="
          px-4 py-2 text-sm rounded-lg
          bg-indigo-600 text-white
          hover:bg-indigo-700
          disabled:bg-indigo-300
          disabled:cursor-not-allowed
          whitespace-nowrap
        "
      >
        {loading ? "Moving…" : "Move"}
      </button>
    </div>
  );
}