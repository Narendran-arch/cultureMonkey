import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { createCompany } from "../../api/companies.api";
import { companySchema } from "../../schema/company.schema";
import FormInput from "../../components/form/FormInput";

export default function CreateCompanyPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- Refs ---------------- */

  const refs = {
    name: useRef(null),
    address: useRef(null),
  };

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

    const validation = companySchema.safeParse(form);

    /* ---- Frontend Validation ---- */
    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });

      setErrors(fieldErrors);

      const firstError = Object.keys(fieldErrors)[0];
      refs[firstError]?.current?.focus();

      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
      };

      await createCompany(payload);

      toast.success("Company created successfully 🎉");

      setForm({
        name: "",
        address: "",
      });

      setErrors({});

      setTimeout(() => {
        navigate("/companies");
      }, 1000);
    } catch (error) {
      console.error(error);

      /* ---- Backend Validation Mapping ---- */
      const backendFieldErrors =
        error.response?.data?.data?.fieldErrors;

      if (backendFieldErrors) {
        const formattedErrors = {};

        Object.keys(backendFieldErrors).forEach((key) => {
          formattedErrors[key] = backendFieldErrors[key][0];
        });

        setErrors(formattedErrors);

        const firstErrorKey =
          Object.keys(formattedErrors)[0];
        refs[firstErrorKey]?.current?.focus();
      }

      toast.error(
        error.response?.data?.statusMessage ||
          "Failed to create company"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Create Company
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to create a new company
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Company Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            inputRef={refs.name}
          />

          <FormInput
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            error={errors.address}
            inputRef={refs.address}
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={() => navigate("/companies")}
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
