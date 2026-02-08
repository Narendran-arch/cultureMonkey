import { useEffect, useState } from "react";
import { getCompanies } from "../api/companies.api";
import { migrateUser } from "../api/users.api";

export default function MigrateUser({ userId, refresh }) {
  const [companies, setCompanies] = useState([]);
  const [target, setTarget] = useState("");

  useEffect(() => {
    getCompanies().then(r => setCompanies(r.data));
  }, []);

  const migrate = async () => {
    if (!target) return;
    await migrateUser(userId, target);
    refresh();
  };

  return (
    <div className="flex space-x-2">
      <select
        className="border rounded p-1 text-sm"
        onChange={e=>setTarget(e.target.value)}
      >
        <option>Move to...</option>
        {companies.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button
        onClick={migrate}
        className="bg-green-600 text-white px-2 rounded text-sm"
      >
        Go
      </button>
    </div>
  );
}
