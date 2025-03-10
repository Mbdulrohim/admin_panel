"use client";

import { useState } from "react";

// Define the User type
type User = {
  id: number;
  clapp_id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  google_id: string;
  profile_image_url: string;
};

export default function ViewUsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      clapp_id: "CLAPP001",
      name: "John Doe",
      email: "john@example.com",
      is_active: true,
      created_at: "2024-05-01",
      updated_at: "2024-06-01",
      google_id: "google123",
      profile_image_url: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      clapp_id: "CLAPP002",
      name: "Jane Doe",
      email: "jane@example.com",
      is_active: false,
      created_at: "2024-05-02",
      updated_at: "2024-06-02",
      google_id: "google456",
      profile_image_url: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      clapp_id: "CLAPP003",
      name: "Alex Smith",
      email: "alex@example.com",
      is_active: true,
      created_at: "2024-05-03",
      updated_at: "2024-06-03",
      google_id: "google789",
      profile_image_url: "https://via.placeholder.com/50",
    },
  ]);

  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adminAction, setAdminAction] = useState<string>("");

  // Filter users based on the search query
  const filteredUsers = search.trim()
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.clapp_id.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const handleUserAction = async (userId: number) => {
    if (!adminAction) return;

    try {
      // Simulate API call
      // Example: await fetch(`/api/users/${userId}`, { method: "PATCH", body: JSON.stringify({ is_active: adminAction === "activate" }) });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, is_active: adminAction === "activate" }
            : user
        )
      );

      alert("User status updated successfully!");
    } catch (error) {
      alert("Failed to update user status.");
    }

    setAdminAction("");
    setSelectedUser(null);
  };

  return (
    <div className="p-8 bg-gray-100 h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

      {/* Search Bar */}
      <div className="w-full max-w-lg mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by CLAPP ID, name, or email..."
          className="w-full p-2 border border-gray-300 rounded-sm focus:outline-hidden"
        />
      </div>

      <div className="flex w-full max-w-6xl gap-6">
        {/* User List */}
        <div className="bg-white shadow-lg rounded-lg w-2/3 overflow-y-auto">
          <ul className="divide-y divide-gray-300">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center">
                    <img
                      src={user.profile_image_url}
                      alt="Profile"
                      className="w-12 h-12 rounded-full mr-4 border border-gray-300 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">Email: {user.email}</p>
                      <p className="text-sm text-gray-500">CLAPP ID: {user.clapp_id}</p>
                      <p
                        className={`text-sm ${
                          user.is_active ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        Status: {user.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No users found.</li>
            )}
          </ul>
        </div>

        {/* Admin Controls */}
        <div className="w-1/3 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Controls</h2>
          {selectedUser ? (
            <div>
              <p className="font-semibold text-gray-700 mb-2">
                Selected User: {selectedUser.name} ({selectedUser.clapp_id})
              </p>
              <select
                value={adminAction}
                onChange={(e) => setAdminAction(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-sm mb-4"
              >
                <option value="">Select Action</option>
                <option value="activate">Activate Account</option>
                <option value="deactivate">Deactivate Account</option>
              </select>
              <button
                onClick={() => selectedUser && handleUserAction(selectedUser.id)}
                disabled={!adminAction}
                className="w-full bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                Apply Action
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Select a user to manage.</p>
          )}
        </div>
      </div>
    </div>
  );
}
