// ...existing code...
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getCompany,
  addUserToCompany,
} from "../api/companies.api";
import { deleteUser, getUsers } from "../api/users.api";
import MapView from "../components/Mapview";
import Input from "../components/Input";
import MigrateUser from "../components/MigrateUser";
import CompanyEdit from "../components/companies/CompanyEdit";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const load = async () => {
    try {
      const c = await getCompany(id);
      const u = await getUsers();
      setCompany(c.data);
      setUsers(u.data.filter((x) => x.company_id == id));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!company) return null;

  const initials = (u) =>
    `${(u.first_name || "").charAt(0)}${(u.last_name || "").charAt(0)}`.toUpperCase();

  const addUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addUserToCompany(id, newUser);
      setNewUser({});
      load();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(uid);
    load();
  };

  const coords =
    company.latitude != null && company.longitude != null
      ? `${Number(company.latitude).toFixed(4)}, ${Number(company.longitude).toFixed(4)}`
      : "No coordinates";

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl font-semibold text-gray-900">{company.name}</h1>
          <p className="mt-1 text-sm text-gray-500 truncate">{company.address}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {company.city || "—"}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
              {company.country || ""}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-white text-gray-500 border border-gray-100">
              {coords}
            </span>
          </div>
        </div>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link
            to="/companies"
            className="text-sm px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-center w-full sm:w-auto"
          >
            Back
          </Link>

          {editing ? (
            <div className="w-full sm:w-auto">
              <CompanyEdit
               company={company}
                submitLabel="Save"
                onSaved={async (data) => {
                  // refresh local company and lists after save
                  setCompany(data || (await getCompany(id)).data);
                  setEditing(false);
                  load();
                }}
                onCancel={() => setEditing(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow text-center w-full sm:w-auto"
            >
              Edit Company
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Location</h2>
            <div className="h-48 sm:h-60 rounded-lg overflow-hidden border border-gray-100">
              <MapView lat={company.latitude} lng={company.longitude} />
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Map shows the primary location for this company. Coordinates are approximate.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
            <span className="text-sm text-gray-500">{users.length} members</span>
          </div>

          <div className="space-y-3 overflow-auto max-h-[360px] sm:max-h-[420px] pr-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                    {initials(u)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {u.first_name} {u.last_name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                    <div className="text-xs text-gray-400 mt-1">{u.designation || "—"}</div>
                  </div>
                </div>

                <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                  <div className="w-full sm:w-auto">
                    <MigrateUser userId={u.id} refresh={load} className="w-full sm:w-auto" />
                  </div>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="text-sm text-red-600 hover:text-red-800 px-3 py-2 rounded-md border border-red-100 bg-white w-full sm:w-auto text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-6">
                No users assigned to this company yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Add a Team Member</h3>

        <form onSubmit={addUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={newUser.first_name ?? ""}
            onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            value={newUser.last_name ?? ""}
            onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newUser.email ?? ""}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <Input
            label="Designation"
            value={newUser.designation ?? ""}
            onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={newUser.dob ?? ""}
            onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
            className="md:col-span-2"
          />

          <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
            >
              {loading ? "Adding…" : "Add Member"}
            </button>
            <button
              type="button"
              onClick={() => setNewUser({})}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ...existing code...