import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getCompany,
  addUserToCompany,
  updateCompany,
  getCompanies,
} from "../../api/companies.api";
import { deleteUser, getUsers, migrateUser } from "../../api/users.api";
import FormInput from "../../components/form/FormInput";
import toast from "react-hot-toast";
import MapView from "../../components/Mapview";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Repeat2 } from "lucide-react";
import MigrateUserModal from "../../components/user/MigrateUserModal";

export default function CompanyDetail() {
  const { id } = useParams();
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const [migrateUserData, setMigrateUserData] = useState(null);
  const [companiesList, setCompaniesList] = useState([]);

  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editCompany, setEditCompany] = useState({
    name: "",
    address: "",
  });

  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    designation: "",
    dob: "",
  });

  const handleUpdateCompany = async (e) => {
    e.preventDefault();

    try {
      await updateCompany(id, editCompany);
      toast.success("Company updated");

      await load(); // reload company → backend recalculates lat/lng
      setEditing(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const load = async () => {
    const c = await getCompany(id);
    const u = await getUsers();
    const companies = await getCompanies(); // 🔥 ADD THIS

    setCompany(c.data);
    setUsers(u.filter((x) => Number(x.company_id) === Number(id)));
    setCompaniesList(companies.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!company) return null;

  const initials = (u) =>
    `${u.first_name?.[0] || ""}${u.last_name?.[0] || ""}`.toUpperCase();

  const addUser = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await addUserToCompany(id, newUser);
      toast.success("User added");
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        designation: "",
        dob: "",
      });
      load();
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      setDeleteId(null);
      load(); // refresh list
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{company.name}</h1>
          <p className="text-sm text-gray-500">{company.address}</p>
        </div>

        <button
          onClick={() => {
            setEditCompany({
              name: company.name,
              address: company.address,
            });
            setEditing(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          {editing ? "Cancel Edit" : "Edit"}
        </button>
      </div>

      {/* EDIT COMPANY (Inline) */}
      {editing && (
        <form
          onSubmit={handleUpdateCompany}
          className="bg-white border rounded-2xl p-6 grid md:grid-cols-2 gap-4"
        >
          <FormInput
            label="Company Name"
            value={editCompany.name}
            onChange={(e) =>
              setEditCompany({ ...editCompany, name: e.target.value })
            }
          />

          <FormInput
            label="Address"
            value={editCompany.address}
            onChange={(e) =>
              setEditCompany({ ...editCompany, address: e.target.value })
            }
          />

          {/* Read Only Lat */}
          <FormInput label="Latitude" value={company.latitude} disabled />

          {/* Read Only Lng */}
          <FormInput label="Longitude" value={company.longitude} disabled />

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* LOCATION */}
      <div className="bg-white rounded-2xl border p-4">
        <h2 className="font-medium mb-3">Location</h2>
        <div className="h-56 rounded-lg overflow-hidden border">
          <MapView
            address={company.address}
            lat={company.latitude}
            lng={company.longitude}
          />
        </div>
      </div>

      {/* TEAM MEMBERS */}
      <div className="bg-white rounded-2xl border p-4">
        <h2 className="font-medium mb-4">Team Members ({users.length})</h2>

        <div className="space-y-4 max-h-[420px] overflow-auto">
          {users.map((u) => (
            <div
              key={u.id}
              className="border rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between gap-4"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                  {initials(u)}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {u.first_name} {u.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                  <p className="text-xs text-gray-400">{u.designation}</p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 self-start sm:self-center">
                {/* VIEW */}
                <button
                  onClick={() => navigate(`/users/${u.id}`)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="View"
                >
                  <Eye size={18} />
                </button>

                {/* EDIT */}
                <button
                  onClick={() => navigate(`/users/${u.id}/edit`)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>

                {/* MIGRATE */}
                <button
                  onClick={() => setMigrateUserData(u)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="Migrate"
                >
                  <Repeat2 size={18} />
                </button>

                {/* DELETE */}
                <button
                  onClick={() => setDeleteId(u.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD USER */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="text-lg font-medium mb-4">Add Team Member</h3>

        <form onSubmit={addUser} className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            required
            value={newUser.first_name}
            onChange={(e) =>
              setNewUser({ ...newUser, first_name: e.target.value })
            }
          />

          <FormInput
            label="Last Name"
            required
            value={newUser.last_name}
            onChange={(e) =>
              setNewUser({ ...newUser, last_name: e.target.value })
            }
          />

          <FormInput
            label="Email"
            type="email"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <FormInput
            label="Designation"
            required
            value={newUser.designation}
            onChange={(e) =>
              setNewUser({ ...newUser, designation: e.target.value })
            }
          />

          <FormInput
            label="Date of Birth"
            type="date"
            required
            value={newUser.dob}
            onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
            className="md:col-span-2"
          />

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg w-full sm:w-auto"
            >
              {loading ? "Adding..." : "Add Member"}
            </button>

            <button
              type="button"
              onClick={() =>
                setNewUser({
                  first_name: "",
                  last_name: "",
                  email: "",
                  designation: "",
                  dob: "",
                })
              }
              className="border px-5 py-2 rounded-lg w-full sm:w-auto"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete User"
        description="This user will be permanently deleted. This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
      <MigrateUserModal
        isOpen={!!migrateUserData}
        user={migrateUserData}
        companies={companiesList}
        onClose={() => setMigrateUserData(null)}
        onMigrate={async (userId, companyId) => {
          await migrateUser(userId, companyId);
          toast.success("User migrated successfully");
          setMigrateUserData(null);
          load();
        }}
      />
    </div>
  );
}
