import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl mx-auto rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div className="flex flex-col justify-center gap-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              CultureMonkey — Manage teams & locations effortlessly
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              CultureMonkey helps you organize organizations, manage employees, and map
              company locations. Create companies, add team members, migrate users,
              and keep location data in sync — all with a clean, responsive UI.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/companies"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition"
              >
                View Companies
              </Link>

              <Link
                to="/users"
                className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-md text-gray-700 transition"
              >
                View Users
              </Link>

              <Link
                to="/companies/new"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-md"
              >
                + Add Company
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 border rounded-lg bg-indigo-50">
                <h4 className="font-medium text-gray-900">Quick onboarding</h4>
                <p className="text-gray-600">Create companies and add users in seconds.</p>
              </div>
              <div className="p-3 border rounded-lg bg-green-50">
                <h4 className="font-medium text-gray-900">Location sync</h4>
                <p className="text-gray-600">Address → coordinates update workflow supported.</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl flex flex-col justify-center">
            <div className="w-full h-56 sm:h-64 rounded-lg border border-gray-100 overflow-hidden bg-white flex items-center justify-center">
              <svg className="w-40 h-40 text-indigo-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 7V4a2 2 0 012-2h6a2 2 0 012 2v3" />
              </svg>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-semibold">•</span>
                Real-time company & user management
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-semibold">•</span>
                Inline editing, migration tools and safe deletes
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-semibold">•</span>
                Mobile responsive, accessible UI
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 text-xs text-gray-500 text-center">
          Built for team admins — quick overview and fast workflows.
        </div>
      </div>
    </div>
  );
}