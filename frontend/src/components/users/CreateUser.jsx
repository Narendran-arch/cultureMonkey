import { useState } from "react";
import { createUser } from "../../api/users.api";
import Input from "../../components/Input";
import toast from "react-hot-toast";

export default function CreateUser({ companies = [], onCreated }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    designation: "",
    dob: "",
    company_id: "",
  });
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    try {
      // convert empty company to null
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        designation: form.designation || null,
        dob: form.dob || null,
        company_id: form.company_id === "" ? null : Number(form.company_id),
      };
      await createUser(payload);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        designation: "",
        dob: "",
        company_id: "",
      });
      onCreated && onCreated();
    } catch (err) {
      console.error("Create user failed:", err);
       toast.error(err?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-4">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input name="first_name" label="First name" value={form.first_name} onChange={change} required />
        <Input name="last_name" label="Last name" value={form.last_name} onChange={change} required />
        <Input name="email" type="email" label="Email" value={form.email} onChange={change} required />

        <Input name="designation" label="Designation" value={form.designation} onChange={change} />
        <Input name="dob" type="date" label="Date of birth" value={form.dob} onChange={change} />

        <div className="flex items-end">
          <label className="block text-xs text-gray-600 mb-1">Company</label>
          <select
            name="company_id"
            value={form.company_id}
            onChange={change}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Unassigned</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 flex items-center gap-3 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}