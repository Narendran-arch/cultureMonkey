import { useState } from "react";
import { createCompany } from "../../api/companies.api";
import Input from "../Input";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";

export default function CreateCompanyModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};

    if (!name.trim()) err.name = "Company name is required";
    else if (name.length < 2)
      err.name = "Company name must be at least 2 characters";

    if (!address.trim()) err.address = "Address is required";
    else if (address.length < 5)
      err.address = "Address must be at least 5 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createCompany({
        name: name.trim(),
        address: address.trim(),
      });

      toast.success("Company created successfully 🎉");
      onSuccess?.(); // refresh list
      onClose();

      setName("");
      setAddress("");
      setErrors({});
    } catch (err) {
      toast.error("Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Company">
      <form onSubmit={submit} className="space-y-6">
        <div>
          <Input
            label="Company Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((er) => ({ ...er, name: undefined }));
            }}
            placeholder="ACME Corporation"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Input
            label="Address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setErrors((er) => ({ ...er, address: undefined }));
            }}
            placeholder="123 Main St, City"
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">{errors.address}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-[#36A192] text-white font-medium hover:bg-[#2e8c80] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Company"}
          </button>
        </div>
      </form>
    </Modal>
  );
}