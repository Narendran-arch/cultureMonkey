import { useEffect, useMemo, useState } from "react";
import { getUsers, deleteUser } from "../../api/users.api";
import { getCompanies } from "../../api/companies.api";
import Input from "../../components/Input";
import CreateUser from "./CreateUser";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    const u = await getUsers();
    const c = await getCompanies();
    setUsers(u?.data || []);
    setCompanies(c?.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (u) => {
    setEditing(u.id);
    setForm({
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      email: u.email || "",
      designation: u.designation || "",
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({});
    setErrors({});
  };

  const validate = () => {
    const e = {};

    if (!form.first_name?.trim()) e.first_name = "First name is required";
    if (!form.last_name?.trim()) e.last_name = "Last name is required";

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      e.email = "Enter a valid email address";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveEdit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      await fetch(`http://localhost:3000/users/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      cancelEdit();
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (editing !== id) {
      alert("Click edit before deleting a user");
      return;
    }

    if (!confirm("Delete this user permanently?")) return;

    await deleteUser(id);
    cancelEdit();
    load();
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, query]);

  const initials = (u) =>
    `${u.first_name?.[0] || ""}${u.last_name?.[0] || ""}`.toUpperCase();

  const fieldClass = (name) =>
    errors[name] ? "border-red-500 focus:ring-red-500" : "";

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <Input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={() => setShowCreate((s) => !s)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
        >
          {showCreate ? "Close" : "+ Add User"}
        </button>
      </div>

      {showCreate && (
        <CreateUser
          companies={companies}
          onCreated={() => {
            load();
            setShowCreate(false);
          }}
        />
      )}

      {/* 📱 MOBILE CARDS */}
      <div className="space-y-3 md:hidden">
        {filtered.map((u) => (
          <div key={u.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-semibold">
                {initials(u)}
              </div>

              <div className="flex-1 space-y-1">
                {editing === u.id ? (
                  <>
                    <Input
                      value={form.first_name}
                      className={fieldClass("first_name")}
                      onChange={(e) =>
                        setForm({ ...form, first_name: e.target.value })
                      }
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-600">{errors.first_name}</p>
                    )}

                    <Input
                      value={form.last_name}
                      className={fieldClass("last_name")}
                      onChange={(e) =>
                        setForm({ ...form, last_name: e.target.value })
                      }
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-600">{errors.last_name}</p>
                    )}

                    <Input
                      value={form.email}
                      className={fieldClass("email")}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email}</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="font-medium">
                      {u.first_name} {u.last_name}
                    </div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 text-sm">
              {editing === u.id ? (
                <>
                  <button
                    disabled={saving}
                    onClick={saveEdit}
                    className="text-green-600"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={cancelEdit} className="text-gray-600">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(u)}
                  className="text-blue-600"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 💻 DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Designation</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 space-y-1">
                  {editing === u.id ? (
                    <>
                      <Input
                        value={form.first_name}
                        className={fieldClass("first_name")}
                        onChange={(e) =>
                          setForm({ ...form, first_name: e.target.value })
                        }
                      />
                      {errors.first_name && (
                        <p className="text-xs text-red-600">
                          {errors.first_name}
                        </p>
                      )}

                      <Input
                        value={form.last_name}
                        className={fieldClass("last_name")}
                        onChange={(e) =>
                          setForm({ ...form, last_name: e.target.value })
                        }
                      />
                      {errors.last_name && (
                        <p className="text-xs text-red-600">
                          {errors.last_name}
                        </p>
                      )}

                      <Input
                        value={form.email}
                        className={fieldClass("email")}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600">{errors.email}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="font-medium">
                        {u.first_name} {u.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </>
                  )}
                </td>

                <td className="px-4 py-3">
                  {u.designation || "—"}
                </td>

                <td className="px-4 py-3 text-right">
                  {editing === u.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="text-green-600 mr-3"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600 mr-3"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(u)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
