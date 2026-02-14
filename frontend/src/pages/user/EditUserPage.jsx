import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { updateUserSchema } from "../../schema/user.schema";
import FormInput from "../../components/form/FormInput";

import { getUser, updateUser } from "../../api/users.api";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    designation: "",
  });

  /* ---------------- Refs ---------------- */

  const refs = {
    first_name: useRef(null),
    last_name: useRef(null),
    email: useRef(null),
    date_of_birth: useRef(null),
    designation: useRef(null),
  };

  /* ---------------- Fetch User ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getUser(id);
        const user = userRes?.data || userRes;

        setForm({
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          email: user.email ?? "",
          date_of_birth: user.dob
            ? new Date(user.dob).toISOString().split("T")[0]
            : "",
          designation: user.designation ?? "",
        });
      } catch (err) {
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ---------------- Change ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = updateUserSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      const firstError = Object.keys(fieldErrors)[0];
      refs[firstError]?.current?.focus();

      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        designation: form.designation.trim(),
        dob: form.date_of_birth,
      };

      await updateUser(id, payload);

      toast.success("User updated successfully 🎉");

      setTimeout(() => {
        navigate("/users");
      }, 800);
    } catch (error) {
      const backendErrors = error.response?.data?.data?.fieldErrors;

      if (backendErrors) {
        const formatted = {};

        Object.keys(backendErrors).forEach((key) => {
          if (key === "dob") {
            formatted["date_of_birth"] = backendErrors[key][0];
          } else {
            formatted[key] = backendErrors[key][0];
          }
        });

        setErrors(formatted);

        const firstErrorKey = Object.keys(formatted)[0];
        refs[firstErrorKey]?.current?.focus();
      }

      toast.error(
        error.response?.data?.statusMessage || "Failed to update user"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Edit User</h1>
          <p className="text-sm text-gray-500">
            Update user details below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              error={errors.first_name}
              inputRef={refs.first_name}
            />

            <FormInput
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              error={errors.last_name}
              inputRef={refs.last_name}
            />
          </div>

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            inputRef={refs.email}
          />

          <FormInput
            label="Date of Birth"
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            error={errors.date_of_birth}
            inputRef={refs.date_of_birth}
          />

          <FormInput
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            error={errors.designation}
            inputRef={refs.designation}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {saving ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
