import { useState } from "react";
import ConfirmModal from "../ui/ConfirmModal";

export default function MigrateUserModal({
  isOpen,
  onClose,
  user,
  companies,
  onMigrate,
}) {
  const [selectedCompany, setSelectedCompany] = useState("");

  const handleSubmit = async () => {
    if (!selectedCompany) return;
    await onMigrate(user.id, selectedCompany);
    setSelectedCompany("");
    onClose();
  };

  if (!user) return null;

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={`Migrate ${user.first_name}`}
      description={
        <div className="space-y-4">
          <p>Select new company:</p>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">Select Company</option>

            {Array.isArray(companies) &&
              companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
          </select>
        </div>
      }
      confirmText="Migrate"
      cancelText="Cancel"
      onConfirm={handleSubmit}
      onCancel={onClose}
    />
  );
}
