import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CompanyList from "./components/companies/CompanyList";
import CompanyDetail from "./pages/CompanyDetailPage";
import UserList from "./components/users/UserList";
import CompanyForm from "./components/companies/CompanyForm";
import UserForm from "./components/users/UserForm";
import WelcomePage from "./pages/WelcomePage";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/companies/new" element={<CompanyForm />} />
        <Route path="/users/new" element={<UserForm />} />
      </Routes>
    </BrowserRouter>
  );
}
