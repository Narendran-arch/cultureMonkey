import { useEffect, useState, useMemo } from "react";
import Button from "../../components/ui/Button";
import UserTableRow from "../../components/user/UserTableRow";
import {
  getUsers,
  activateUser,
  deactivateUser,
  deleteUser,
  migrateUser,
} from "../../api/users.api";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ui/ConfirmModal";
import MigrateUserModal from "../../components/user/MigrateUserModal";
import { getCompanies } from "../../api/companies.api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [migrateUserData, setMigrateUserData] = useState(null);

  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ---------------- FETCH DATA ----------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompaniesList(data.data);
    } catch (err) {
      console.error("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  // ---------------- ACTION HANDLERS ----------------

  const handleMigrate = async (id, company_id) => {
    await migrateUser(id, company_id);

    // Optimistic state update (no full refetch needed)
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              company_id,
              company_name:
                companiesList.find((c) => c.id === company_id)?.name ||
                u.company_name,
            }
          : u,
      ),
    );

    setMigrateUserData(null);
  };

  const handleToggle = async (user) => {
    if (user.is_active) {
      await deactivateUser(user.id);
    } else {
      await activateUser(user.id);
    }

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, is_active: !u.is_active } : u,
      ),
    );
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await deleteUser(deleteId);

    // Remove from state instead of refetch
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
  };

  // ---------------- MEMOIZED FILTER ----------------

  const companies = useMemo(() => {
    return [...new Set(users.map((u) => u.company_name).filter(Boolean))];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesCompany =
        !companyFilter || user.company_name === companyFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);

      const matchesSearch =
        !search ||
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      return matchesCompany && matchesStatus && matchesSearch;
    });
  }, [users, companyFilter, statusFilter, search]);

  // ---------------- UI ----------------

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Users</h1>
          <p className="text-sm text-gray-500">
            Manage all users across companies
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {filteredUsers.length} users found
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/users/new")}
        >
          + Create User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full lg:w-64"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
          Loading users...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-red-500">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          {/* ---------------- DESKTOP TABLE ---------------- */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs sm:text-sm">
                <tr className="text-left">
                  <th className="p-4">Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      onToggle={handleToggle}
                      onDelete={(id) => setDeleteId(id)}
                      onMigrate={() => setMigrateUserData(user)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ---------------- MOBILE CARDS ---------------- */}
          <div className="md:hidden space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow-sm border p-4 space-y-3"
                >
                  {/* Name + Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.is_active
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="text-gray-400">Company:</span>{" "}
                      {user.company_name || "-"}
                    </p>
                    <p>
                      <span className="text-gray-400">Designation:</span>{" "}
                      {user.designation || "-"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-3 border-t">
                    <button
                      onClick={() => handleToggle(user)}
                      className="text-sm text-blue-600"
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setMigrateUserData(user)}
                        className="text-sm text-gray-600"
                      >
                        Migrate
                      </button>

                      <button
                        onClick={() => setDeleteId(user.id)}
                        className="text-sm text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-400">
                No users found
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <MigrateUserModal
        isOpen={!!migrateUserData}
        user={migrateUserData}
        companies={companiesList}
        onClose={() => setMigrateUserData(null)}
        onMigrate={handleMigrate}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete User"
        description="This user will be permanently deleted. This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
