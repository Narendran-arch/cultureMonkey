import {
  Plus,
  ChevronDown,
  Building2,
  UserCheck,
  UserX,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/dashboard/StatCard";
import { getCompanies } from "../api/companies.api";
import { getUsers } from "../api/users.api";

const Dashboard = () => {
  /* ---------------- State ---------------- */
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("recent");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  /* ---------------- Fetch Data ---------------- */
  const fetchDashboardData = async () => {
    try {
      const [companiesRes, usersRes] = await Promise.all([
        getCompanies(),
        getUsers(),
      ]);

      setCompanies(companiesRes.data || []);
      setUsers(usersRes.data || usersRes || []);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ---------------- Close Dropdown Outside Click ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Derived Stats ---------------- */
  const activeUsers = users.filter(
    (u) => Number(u.is_active) === 1
  ).length;

  const inactiveUsers = users.length - activeUsers;

  const recentCompanies = [...companies].slice(-5).reverse();

  const filteredCompanies = useMemo(() => {
    if (companyFilter === "recent") {
      return recentCompanies;
    }

    if (companyFilter === "all") {
      return companies.slice(0, 5);
    }

    if (companyFilter === "oldest") {
      return companies.slice(0, 5).reverse();
    }

    return recentCompanies;
  }, [companyFilter, companies, recentCompanies]);

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>

        {/* CREATE DROPDOWN */}
        <div className="relative self-end sm:self-auto" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-[#36A192] px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-[#2e8c80] transition"
          >
            <Plus size={16} />
            Create
            <ChevronDown size={16} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/companies/new");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <Building2 size={16} />
                Create Company
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/users/new");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <UserPlus size={16} />
                Create User
              </button>
            </div>
          )}
        </div>
      </header>

      {/* OVERVIEW */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase">
          Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<Building2 size={18} />}
            value={companies.length}
            label="Total Companies"
            valueColor="text-orange-500"
          />

          <StatCard
            icon={<UserCheck size={18} />}
            value={activeUsers}
            label="Active Users"
            valueColor="text-green-600"
          />

          <StatCard
            icon={<UserX size={18} />}
            value={inactiveUsers}
            label="Inactive Users"
            valueColor="text-red-500"
          />
        </div>
      </section>

      {/* RECENT COMPANIES */}
      <div className="bg-white rounded-2xl border p-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Recent Companies
          </h3>

          <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
            {["recent", "all", "oldest"].map((type) => (
              <button
                key={type}
                onClick={() => setCompanyFilter(type)}
                className={`px-4 py-1.5 text-xs rounded-md transition ${
                  companyFilter === type
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        {filteredCompanies.length === 0 ? (
          <p className="text-sm text-gray-400">
            No companies found.
          </p>
        ) : (
          <div className="divide-y">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-start justify-between gap-4 py-4 hover:bg-gray-50 px-2 rounded-lg transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {company.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {company.city || company.address}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-gray-400 whitespace-nowrap">
                  ID: {company.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
