import { useState, useEffect } from "react";
import { createUser } from "../../api/users.api";
import { getCompanies } from "../../api/companies.api";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";

export default function UserForm() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    getCompanies().then(r => setCompanies(r.data));
  }, []);

  const submit = async e => {
    e.preventDefault();
    await createUser(form);
    nav("/users");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-bold mb-4">Create User</h2>

      <form onSubmit={submit} className="space-y-3">
        <Input label="First Name" onChange={e=>setForm({...form, first_name:e.target.value})} />
        <Input label="Last Name" onChange={e=>setForm({...form, last_name:e.target.value})} />
        <Input label="Email" type="email" onChange={e=>setForm({...form, email:e.target.value})} />
        <Input label="Designation" onChange={e=>setForm({...form, designation:e.target.value})} />
        <Input label="DOB" type="date" onChange={e=>setForm({...form, dob:e.target.value})} />

        <select
          className="w-full border rounded p-2"
          onChange={e=>setForm({...form, company_id:e.target.value})}
        >
          <option>Select Company</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Create User
        </button>
      </form>
    </div>
  );
}
