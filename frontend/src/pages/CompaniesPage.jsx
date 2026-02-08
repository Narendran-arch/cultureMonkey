import { useCompanies } from "../hooks/useCompanies";
import CompanyList from "../components/companies/CompanyList";

export default function CompaniesPage() {
  const { companies, error } = useCompanies();

  if (error) return <p>{error}</p>;

  return <CompanyList companies={companies} />;
}
