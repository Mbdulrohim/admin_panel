"use client";

import { useEffect, useState } from 'react';

// Define the Admin type
interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  createdat: string; // Use string to handle ISO date format
  updatedat: string; // Use string to handle ISO date format
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null); // Define the type for admin

  useEffect(() => {
    async function fetchAdmin() {
      const response = await fetch('/api/admins/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token from local storage
        },
      });

      if (response.ok) {
        const data: Admin = await response.json(); // Explicitly type the response
        setAdmin(data);
      } else {
        console.log('Failed to fetch admin details.');
      }
    }

    fetchAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'; // Remove token from cookies
    window.location.href = '/login';
  };

  if (!admin) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome, {admin.name}
      </h1>
      <div className="mb-4">
        <p className="text-lg text-gray-700">
          Email: <span className="font-medium">{admin.email}</span>
        </p>
        <p className="text-lg text-gray-700">
          Role: <span className="font-medium">{admin.role}</span>
        </p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Created At: {new Date(admin.createdat).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Updated At: {new Date(admin.updatedat).toLocaleString()}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
