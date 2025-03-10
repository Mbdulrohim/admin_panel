"use client";

import { useState } from 'react';

export default function CourseApprovalPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Introduction to Nutrition',
      type: 'Course',
      uploaded_by: 'John Doe',
      link: 'https://example.com/nutrition-course',
      status: 'Pending',
      uploaded_at: '2024-06-01',
    },
    {
      id: 2,
      title: 'Healthy Living PDF',
      type: 'Book',
      uploaded_by: 'Jane Doe',
      link: 'https://example.com/healthy-living.pdf',
      status: 'Approved',
      uploaded_at: '2024-06-02',
    },
  ]);

  const [search, setSearch] = useState("");

  const handleApproval = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Approved' } : item
      )
    );
  };

  const handleUnlist = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Unlisted' } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.uploaded_by.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Course & Book Approval</h1>

      {/* Search Bar */}
      <div className="w-full max-w-lg mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or uploader..."
          className="w-full p-2 border border-gray-300 rounded-sm focus:outline-hidden"
        />
      </div>

      {/* Items List */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl overflow-y-auto">
        <ul className="divide-y divide-gray-300">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li key={item.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.title} <span className="text-sm text-gray-500">({item.type})</span>
                  </p>
                  <p className="text-sm text-gray-500">Uploaded by: {item.uploaded_by}</p>
                  <p className="text-sm text-gray-500">Uploaded at: {item.uploaded_at}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                  <p
                    className={`text-sm font-medium mt-2 ${
                      item.status === 'Pending'
                        ? 'text-yellow-500'
                        : item.status === 'Approved'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    Status: {item.status}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {item.status === 'Pending' && (
                    <button
                      onClick={() => handleApproval(item.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  {item.status === 'Approved' && (
                    <button
                      onClick={() => handleUnlist(item.id)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded-sm hover:bg-yellow-600"
                    >
                      Unlist
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">No items found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
