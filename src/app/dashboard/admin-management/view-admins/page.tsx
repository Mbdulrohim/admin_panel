"use client";

import { useState } from "react";

// Define Admin type
interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 1, name: "Super Admin", email: "superadmin@example.com", role: "Super Admin", created_at: "2024-05-01" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "Editor", created_at: "2024-06-02" },
    { id: 3, name: "Jane Smith", email: "jane@example.com", role: "Moderator", created_at: "2024-06-05" },
  ]);

  const [search, setSearch] = useState<string>("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [adminRole, setAdminRole] = useState<string>("");
  const [newAdmin, setNewAdmin] = useState<Partial<Admin> & { password: string }>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleDelete = (id: number) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
  };

  const handleRoleUpdate = () => {
    if (selectedAdmin && adminRole) {
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === selectedAdmin.id ? { ...admin, role: adminRole } : admin
        )
      );
      setSelectedAdmin(null);
      setAdminRole("");
    }
  };

  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.email && newAdmin.password && newAdmin.role) {
      setAdmins((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          created_at: new Date().toISOString().split("T")[0],
        } as Admin,
      ]);
      setNewAdmin({ name: "", email: "", password: "", role: "" });
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 h-screen flex flex-col items-center">
      {/* Search Bar */}
      <div className="w-full max-w-lg mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search admins by name or email..."
          className="w-full p-2 border border-gray-300 rounded-sm focus:outline-hidden"
        />
      </div>

      {/* Admin List and Role Management */}
      <div className="flex w-full max-w-6xl gap-6">
        {/* Admin List */}
        <div className="bg-white shadow-lg rounded-lg w-2/3 overflow-y-auto">
          <ul className="divide-y divide-gray-300">
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <li
                  key={admin.id}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{admin.name}</p>
                    <p className="text-sm text-gray-500">Email: {admin.email}</p>
                    <p className="text-sm text-gray-500">Role: {admin.role}</p>
                    <p className="text-sm text-gray-500">Created At: {admin.created_at}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-sm hover:bg-blue-700"
                    >
                      Edit Role
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No admins found.</li>
            )}
          </ul>
        </div>

        {/* Add Admin Section */}
        <div className="w-1/3 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Admin</h2>
          <input
            type="text"
            placeholder="Name"
            value={newAdmin.name || ""}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-sm mb-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={newAdmin.email || ""}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-sm mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={newAdmin.password || ""}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-sm mb-2"
          />
          <select
            value={newAdmin.role || ""}
            onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-sm mb-4"
          >
            <option value="">Select Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Editor">Editor</option>
            <option value="Moderator">Moderator</option>
          </select>
          <button
            onClick={handleAddAdmin}
            className="w-full bg-green-600 text-white py-2 rounded-sm hover:bg-green-700 transition"
          >
            Add Admin
          </button>
        </div>
      </div>
    </div>
  );
}
