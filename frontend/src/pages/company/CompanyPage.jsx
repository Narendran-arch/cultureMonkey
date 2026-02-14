import { useEffect, useState, useMemo } from "react";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { getCompanies, deleteCompany } from "../../api/companies.api";
import { Building2, Pencil, Eye, Trash2 } from "lucide-react";

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteErrorModal, setDeleteErrorModal] = useState(false);

  const [search, setSearch] = useState("");
  const [addressFilter, setAddressFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ---------------- FETCH ----------------

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await getCompanies();
      setCompanies(res?.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ---------------- DELETE ----------------

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCompany(deleteId);

      setCompanies((prev) => prev.filter((c) => c.id !== deleteId));

      setDeleteId(null);
    } catch (err) {
      if (err?.response?.status === 409) {
        setDeleteId(null); // close confirm modal
        setDeleteErrorModal(
          err?.response?.data?.statusMessage ||
            "Cannot delete company with active users.",
        );
      } else {
        alert("Something went wrong.");
      }
    }
  };

  // ---------------- FILTERS ----------------

  const addresses = useMemo(() => {
    return [...new Set(companies.map((c) => c.address).filter(Boolean))];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesAddress =
        !addressFilter || company.address === addressFilter;

      const matchesSearch =
        !search ||
        company.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(company.id).includes(search.toLowerCase());

      return matchesAddress && matchesSearch;
    });
  }, [companies, addressFilter, search]);

  // ---------------- UI ----------------

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Companies</h1>
          <p className="text-sm text-gray-500">
            Manage all client organizations
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {filteredCompanies.length} companies found
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/companies/new")}
        >
          + Create Company
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <select
            value={addressFilter}
            onChange={(e) => setAddressFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="">All Locations</option>
            {addresses.map((addr) => (
              <option key={addr} value={addr}>
                {addr}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full lg:w-64"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
          Loading companies...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-red-500">
          {error}
        </div>
      )}

      {/* Table */}
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs sm:text-sm">
            <tr className="text-left">
              <th className="p-4">Company</th>
              <th>ID</th>
              <th>Address</th>
              <th>Users</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <tr key={company.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Building2 size={16} className="text-teal-600" />
                    </div>
                    {company.name}
                  </td>

                  <td>{company.id}</td>
                  <td>{company.address || "-"}</td>
                  <td>{company.user_count ?? 0}</td>

                  <td className="text-right pr-6">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => navigate(`/companies/${company.id}`)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/companies/${company.id}/edit`)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteId(company.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  No companies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl shadow-sm border p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Building2 size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">{company.name}</p>
                  <p className="text-xs text-gray-500">ID: {company.id}</p>
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="text-gray-400">Address:</span>{" "}
                  {company.address || "-"}
                </p>
                <p>
                  <span className="text-gray-400">Users:</span>{" "}
                  {company.user_count ?? 0}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-2 border-t">
                <button
                  onClick={() => navigate(`/companies/${company.id}`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Eye size={18} />
                </button>

                <button
                  onClick={() => navigate(`/companies/${company.id}/edit`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => setDeleteId(company.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-400">
            No companies found
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Company"
        description="This company will be permanently deleted. This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
      {/* Delete Blocked Modal */}
      <ConfirmModal
        isOpen={deleteErrorModal}
        title="Cannot Delete Company"
        description={
          <div className="space-y-2">
            <p>This company has active users associated with it.</p>
            <p className="text-sm text-gray-500">
              Please migrate users to another company or delete them before
              deleting this company.
            </p>
          </div>
        }
        confirmText="Go to Users"
        cancelText="Close"
        onConfirm={() => {
          setDeleteErrorModal(false);
          navigate("/users");
        }}
        onCancel={() => setDeleteErrorModal(false)}
      />
    </div>
  );
}
