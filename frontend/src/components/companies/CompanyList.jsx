import { useEffect, useMemo, useState } from "react";
import { getCompanies, deleteCompany } from "../../api/companies.api";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import toast from "react-hot-toast";

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCompanies();
      setCompanies(res.data || []);
    } catch (e) {
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.address || "").toLowerCase().includes(q)
    );
  }, [companies, query]);

  const initials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      await deleteCompany(id);
      await load();
    } catch {
       toast.error("Cannot delete company with active users. Migrate users first.");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------- UI STATES ----------

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">{error}</div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Companies</h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of organizations. Create, view and manage company details.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies or address..."
            className="w-full md:w-72"
          />

          <Link
            to="/companies/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            + Add Company
          </Link>
        </div>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 p-4 flex flex-col"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                {initials(c.name)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{c.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {c.address || "No address provided"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <Link
                to={`/companies/${c.id}`}
                className="text-indigo-600 hover:text-indigo-800"
              >
                View
              </Link>

              <button
                disabled={deletingId === c.id}
                onClick={() => handleDelete(c.id)}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {deletingId === c.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="mt-10 border border-dashed rounded-lg p-8 text-center">
          <p className="text-lg font-medium">No companies found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try searching or create a new company
          </p>
          <Link
            to="/companies/new"
            className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            + Add Company
          </Link>
        </div>
      )}

    </div>
  );
}
