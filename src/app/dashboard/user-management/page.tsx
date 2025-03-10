"use client";

import { useState } from 'react';

export default function ViewUsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', coins: 500, joined: '2024-05-01' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', coins: 300, joined: '2024-05-02' },
    { id: 3, name: 'Alex Smith', email: 'alex@example.com', coins: 700, joined: '2024-05-03' },
  ]);

  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User List</h1>

      {/* Search Bar */}
      <div className="w-full max-w-lg mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full p-2 border border-gray-300 rounded-sm focus:outline-hidden"
        />
      </div>

      {/* User List */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg overflow-y-auto">
        <ul className="divide-y divide-gray-300">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li key={user.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">Joined: {user.joined}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{user.coins} Coins</p>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">No users found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
