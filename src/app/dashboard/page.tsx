'use client';

import { useState, useEffect } from 'react';

type Stats = {
  users: number;
  activeSubscriptions: number;
  contentItems: number;
  forums: number;
  pendingApprovals: number;
  completedTransactions: number;
};

export default function AdminHome() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    activeSubscriptions: 0,
    contentItems: 0,
    forums: 0,
    pendingApprovals: 0,
    completedTransactions: 0,
  });
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.log('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleNavigation = (url: string) => {
    window.location.href = url; // Navigate to the specified URL
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-6">CLAPP Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Stats */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{stats.users}</p>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Active Subscriptions</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{stats.activeSubscriptions}</p>
        </div>

        {/* Content Items */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Total Content Items</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{stats.contentItems}</p>
        </div>

        {/* Forums */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Active Forums</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{stats.forums}</p>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Pending Approvals</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{stats.pendingApprovals}</p>
        </div>

        {/* Completed Transactions */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Completed Transactions</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{stats.completedTransactions}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-green-700 transition"
            onClick={() => handleNavigation('http://localhost:3000/dashboard/user-management/view-users')}
          >
            Manage Users
          </button>
          <button
            className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-green-700 transition"
            onClick={() => handleNavigation('http://localhost:3000/dashboard/content-management')}
          >
            Manage Content
          </button>
          <button
            className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-green-700 transition"
            onClick={() => handleNavigation('http://localhost:3000/dashboard/forums/approvals')}
          >
            Approve Forums
          </button>
          <button
            className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-green-700 transition"
            onClick={() => handleNavigation('http://localhost:3000/dashboard/notifications')}
          >
            Send Notifications
          </button>
          <button
            className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-green-700 transition"
            onClick={() => handleNavigation('http://localhost:3000/dashboard/reports')}
          >
            View Reports
          </button>
          <button
            className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-green-700 transition"
            onClick={() => handleNavigation('http://localhost:3000/dashboard/settings')}
          >
            Manage Settings
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <p className="text-gray-600">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
