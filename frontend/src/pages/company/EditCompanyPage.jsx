import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import {
  getCompany,
  updateCompany,
} from "../../api/companies.api";
import { companySchema } from "../../schema/company.schema";
import FormInput from "../../components/form/FormInput";

export default function EditCompanyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ---------------- Refs ---------------- */

  const refs = {
    name: useRef(null),
    address: useRef(null),
  };

  /* ---------------- Fetch Company ---------------- */

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setFetching(true);
        const res = await getCompany(id);

        const company = res?.data || res;

        setForm({
          name: company.name || "",
          address: company.address || "",
        });
      } catch (error) {
        toast.error("Failed to load company");
        navigate("/companies");
      } finally {
        setFetching(false);
      }
    };

    fetchCompany();
  }, [id, navigate]);

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

      await updateCompany(id, payload);

      toast.success("Company updated successfully 🎉");

      setTimeout(() => {
        navigate("/companies");
      }, 1000);
    } catch (error) {
      console.error(error);

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
          "Failed to update company"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="bg-white border rounded-xl shadow-sm p-6 text-gray-500">
          Loading company...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Edit Company
          </h1>
          <p className="text-sm text-gray-500">
            Update company information below
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
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
