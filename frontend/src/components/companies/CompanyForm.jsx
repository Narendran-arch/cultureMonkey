import { useState } from "react";
import { createCompany } from "../../api/companies.api";
import Input from "../../components/Input";
import { useNavigate, Link } from "react-router-dom";

export default function CompanyForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const validate = () => {
    const err = {};

    if (!name.trim()) {
      err.name = "Company name is required";
    } else if (name.length < 2) {
      err.name = "Company name must be at least 2 characters";
    }

    if (!address.trim()) {
      err.address = "Address is required";
    } else if (address.length < 5) {
      err.address = "Address must be at least 5 characters";
    }

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
      nav("/companies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mt-8">

      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M7 7V4a2 2 0 012-2h6a2 2 0 012 2v3" />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Create Company</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a new organization to manage employees and assignments.
          </p>
        </div>
      </div>

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
            className="bg-white/90 border-gray-200"
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
            placeholder="123 Main St, City, Country"
            className="bg-white/90 border-gray-200"
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">{errors.address}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Company"}
          </button>

          <Link
            to="/companies"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
        </div>

      </form>
    </div>
  );
}
