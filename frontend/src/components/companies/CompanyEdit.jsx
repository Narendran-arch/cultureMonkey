import { useEffect, useState } from "react";
import { updateCompany, getCompany } from "../../api/companies.api";
import Input from "../../components/Input";
import toast from "react-hot-toast";

export default function CompanyEdit({
  company = {},
  onSaved,
  onCancel,
  submitLabel = "Save",
}) {
  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: company.name ?? "",
      address: company.address ?? "",
    });
    setErrors({});
  }, [company]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    // live clear error
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  // ---------- VALIDATION ----------

  const validateForm = () => {
    const err = {};

    if (!form.name.trim()) {
      err.name = "Company name is required";
    } else if (form.name.length < 2) {
      err.name = "Company name must be at least 2 characters";
    }

    if (form.address && form.address.length < 5) {
      err.address = "Address must be at least 5 characters";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ---------- SUBMIT ----------

  const submit = async (e) => {
    e.preventDefault();

    if (!company.id) return;

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
      };

      await updateCompany(company.id, payload);

      let latest = null;
      for (let i = 0; i < 6; i++) {
        const res = await getCompany(company.id);
        latest = res?.data ?? res;

        if (latest?.latitude != null && latest?.longitude != null) break;

        await new Promise((r) => setTimeout(r, 1000));
      }

      onSaved && onSaved(latest ?? { id: company.id, ...payload });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Input
            name="name"
            label="Company Name"
            value={form.name}
            onChange={change}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Input
            name="address"
            label="Address"
            value={form.address}
            onChange={change}
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">{errors.address}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm disabled:opacity-60"
          >
            {loading ? "Saving..." : submitLabel}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
