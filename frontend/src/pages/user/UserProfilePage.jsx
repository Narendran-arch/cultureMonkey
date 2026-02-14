import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import MigrateUserModal from "../../components/user/MigrateUserModal";
import {
  getUser,
  activateUser,
  deactivateUser,
  migrateUser,
} from "../../api/users.api";
import { getCompanies } from "../../api/companies.api";

export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMigrate, setShowMigrate] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await getUser(id);
      const companyRes = await getCompanies();

      setUser(userRes);
      setCompanies(companyRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;

    if (user.is_active) {
      await deactivateUser(user.id);
    } else {
      await activateUser(user.id);
    }

    fetchData();
  };

  const handleMigrate = async (userId, companyId) => {
    await migrateUser(userId, companyId);
    setShowMigrate(false);
    fetchData();
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading profile...</div>;

  if (!user)
    return <div className="p-6 text-red-500">User not found.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user.first_name} {user.last_name}
        </h1>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/users/${user.id}/edit`)}
          >
            ✏️ Edit
          </Button>

          <Button
            variant="secondary"
            onClick={handleToggleStatus}
          >
            {user.is_active ? "Deactivate" : "Activate"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowMigrate(true)}
          >
            ⇄ Migrate
          </Button>
        </div>
      </div>

      {/* ===== DETAILS CARD ===== */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">

          <ProfileItem
            label="Full Name"
            value={`${user.first_name} ${user.last_name}`}
          />

          <ProfileItem label="Email" value={user.email} />

          <ProfileItem
            label="Date of Birth"
            value={user.dob ? user.dob.split("T")[0] : "-"}
          />

          <ProfileItem label="Designation" value={user.designation} />

          <ProfileItem label="Company" value={user.company_name} />

          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                user.is_active
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </div>

        </div>
      </div>

      {/* ===== MIGRATION MODAL ===== */}
      <MigrateUserModal
        isOpen={showMigrate}
        user={user}
        companies={companies}
        onClose={() => setShowMigrate(false)}
        onMigrate={handleMigrate}
      />
    </div>
  );
}

/* ===== Reusable Field Component ===== */

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-gray-900 font-medium">{value || "-"}</p>
    </div>
  );
}
