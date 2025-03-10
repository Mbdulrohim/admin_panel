'use client';

import { useState, useEffect } from 'react';

export default function StatisticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: 15,
    activeUsers: 120,
    revenue: 3400,
    engagementRate: 75,
    topContent: 'How to Stay Healthy',
    contentPerformance: [
      { title: 'Medicinal Plants Overview', views: 2500 },
      { title: 'Drugs and Side Effects', views: 1800 },
      { title: 'Healthy Lifestyle Tips', views: 3000 },
    ],
    topCourse: 'Advanced Nutrition',
    topBook: 'The Body Keeps the Score',
    newUsers: 45,
  });

  useEffect(() => {
    console.log('Analytics data loaded:', analyticsData);
  }, [analyticsData]);

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Analytics / Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">User Growth</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{analyticsData.userGrowth}%</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Active Users</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{analyticsData.activeUsers}</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Revenue</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">${analyticsData.revenue}</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Engagement Rate</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{analyticsData.engagementRate}%</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Top Content</h2>
          <p className="text-lg text-gray-600 mt-2">{analyticsData.topContent}</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">New Users</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{analyticsData.newUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Top Course</h2>
          <p className="text-lg font-bold text-green-800 mt-2">{analyticsData.topCourse}</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Top Book</h2>
          <p className="text-lg font-bold text-green-800 mt-2">{analyticsData.topBook}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Performance</h2>
        <div className="bg-white shadow-sm rounded-lg p-6">
          {analyticsData.contentPerformance.length ? (
            <ul className="space-y-2">
              {analyticsData.contentPerformance.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item.title} - <span className="font-semibold text-green-800">{item.views} views</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No performance data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
