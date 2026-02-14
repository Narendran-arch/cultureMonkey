import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { createUser } from "../../api/users.api";
import { getCompanies } from "../../api/companies.api";
import { userSchema } from "../../schema/user.schema";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";

export default function CreateUserPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    designation: "",
    company_id: "",
  });

  const [errors, setErrors] = useState({});
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- Refs for Auto Focus ---------------- */

  const refs = {
    first_name: useRef(null),
    last_name: useRef(null),
    email: useRef(null),
    date_of_birth: useRef(null),
    designation: useRef(null),
    company_id: useRef(null),
  };

  /* ---------------- Fetch Companies ---------------- */

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getCompanies();

        const companyList = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

        setCompanies(companyList);
      } catch (error) {
        toast.error("Failed to load companies");
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

  /* ---------------- Handle Change ---------------- */

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

    const validation = userSchema.safeParse(form);

    /* ---- Frontend Validation ---- */
    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });

      setErrors(fieldErrors);

      // Auto-focus first invalid field
      const firstError = Object.keys(fieldErrors)[0];
      refs[firstError]?.current?.focus();

      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);

      /* ---- Payload Normalization ---- */
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        designation: form.designation.trim(),
        dob: form.date_of_birth,
        company_id: Number(form.company_id),
      };

      await createUser(payload);

      toast.success("User created successfully 🎉");

      /* ---- Reset Form ---- */
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        designation: "",
        company_id: "",
      });

      setErrors({});

      setTimeout(() => {
        navigate("/users");
      }, 1000);
    } catch (error) {
      console.error(error);

      /* ---- Backend Validation Mapping ---- */
      const backendFieldErrors = error.response?.data?.data?.fieldErrors;

      if (backendFieldErrors) {
        const formattedErrors = {};

        Object.keys(backendFieldErrors).forEach((key) => {
          if (key === "dob") {
            formattedErrors["date_of_birth"] = backendFieldErrors[key][0];
          } else {
            formattedErrors[key] = backendFieldErrors[key][0];
          }
        });

        setErrors(formattedErrors);

        const firstErrorKey = Object.keys(formattedErrors)[0];
        refs[firstErrorKey]?.current?.focus();
      }

      toast.error(
        error.response?.data?.statusMessage || "Failed to create user",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create User</h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to create a new user
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First + Last */}
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

          {/* Email */}
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            inputRef={refs.email}
          />

          {/* DOB */}
          <FormInput
            label="Date of Birth"
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            error={errors.date_of_birth}
            inputRef={refs.date_of_birth}
          />

          {/* Designation */}
          <FormInput
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            error={errors.designation}
            inputRef={refs.designation}
          />

          {/* Company */}
          <FormSelect
            label="Company"
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            error={errors.company_id}
            inputRef={refs.company_id}
            options={companies}
            placeholder="Select company"
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={() => navigate("/users")}
              variant="secondary"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
