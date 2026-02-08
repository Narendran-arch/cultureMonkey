import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between">
      <Link to="/"><h1 className="font-bold text-xl text-blue-600">Company Manager</h1></Link>
      <div className="space-x-6">
        <Link to="/companies" className="hover:text-blue-600">Companies</Link>
        <Link to="/users" className="hover:text-blue-600">Users</Link>
      </div>
    </div>
  );
}
