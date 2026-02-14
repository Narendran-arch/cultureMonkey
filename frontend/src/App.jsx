import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DashboardLayout from "./layout/DashboardLayout";
import PublicLayout from "./layout/PublicLayout";

import CompanyDetail from "./pages/company/CompanyDetailPage";
import CreateCompanyPage from "./pages/company/CreateCompanyPage"
import Dashboard from "./pages/Dashboard";
import CompanyPage from "./pages/company/CompanyPage";
import UsersPage from "./pages/user/UsersPage";
import EditUserPage from "./pages/user/EditUserPage";
import CreateUserPage from "./pages/user/CreateUserPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import EditCompanyPage from "./pages/company/EditCompanyPage";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      {/* Global UI */}
      <Toaster position="top-right" />

      <Routes>
        {/* PUBLIC ROUTES — NO SIDEBAR */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* DASHBOARD ROUTES — WITH SIDEBAR */}
        <Route element={<DashboardLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/companies/new" element={<CreateCompanyPage />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/companies/:id/edit" element={<EditCompanyPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/new" element={<CreateUserPage />} />
          <Route path = "/users/:id/edit" element={<EditUserPage/>} />
          <Route path = "/users/:id" element={<UserProfilePage/>} />
 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
