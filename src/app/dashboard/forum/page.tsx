"use client";

import { useState } from "react";

// Define Forum type
type Forum = {
  id: number;
  title: string;
  description: string;
  creator: string;
  status: "Pending" | "Active";
};

export default function ForumPage() {
  const [forums, setForums] = useState<Forum[]>([
    {
      id: 1,
      title: "Managing Anxiety",
      description:
        "A forum for sharing experiences and tips on dealing with anxiety.",
      creator: "Admin",
      status: "Active",
    },
  ]);

  const [newForum, setNewForum] = useState<Partial<Forum>>({
    title: "",
    description: "",
    creator: "",
    status: "Pending",
  });

  const [editingForum, setEditingForum] = useState<Forum | null>(null);

  const handleInputChange = (field: keyof Forum, value: string) => {
    setNewForum((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddForum = () => {
    if (newForum.title?.trim() !== "" && newForum.description?.trim() !== "") {
      const newId = forums.length + 1;
      setForums((prev) => [
        ...prev,
        { ...newForum, id: newId } as Forum,
      ]);
      setNewForum({
        title: "",
        description: "",
        creator: "",
        status: "Pending",
      });
    }
  };

  const handleEdit = (forum: Forum) => {
    setEditingForum(forum);
    setNewForum(forum);
  };

  const handleSaveEdit = () => {
    if (editingForum) {
      setForums((prev) =>
        prev.map((forum) =>
          forum.id === editingForum.id
            ? { ...newForum, id: editingForum.id } as Forum
            : forum
        )
      );
      setEditingForum(null);
      setNewForum({
        title: "",
        description: "",
        creator: "",
        status: "Pending",
      });
    }
  };

  const handleDelete = (id: number) => {
    setForums((prev) => prev.filter((forum) => forum.id !== id));
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        Forum Management
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingForum ? "Edit Forum" : "Create a New Forum"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newForum.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Forum Title"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <textarea
            value={newForum.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter description"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <input
            type="text"
            value={newForum.creator || ""}
            onChange={(e) => handleInputChange("creator", e.target.value)}
            placeholder="Creator (e.g., Admin or User)"
            className="p-2 border border-gray-300 rounded-sm"
          />
        </div>
        <button
          onClick={editingForum ? handleSaveEdit : handleAddForum}
          className="bg-green-600 text-white px-4 py-2 rounded-sm mt-4 hover:bg-green-700"
        >
          {editingForum ? "Save Changes" : "Create Forum"}
        </button>
        {editingForum && (
          <button
            onClick={() => setEditingForum(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-sm mt-4 ml-2 hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Forum List</h2>
        {forums.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Title</th>
                <th className="border border-gray-300 p-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Creator
                </th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {forums.map((forum) => (
                <tr key={forum.id}>
                  <td className="border border-gray-300 p-2">{forum.id}</td>
                  <td className="border border-gray-300 p-2">{forum.title}</td>
                  <td className="border border-gray-300 p-2">
                    {forum.description}
                  </td>
                  <td className="border border-gray-300 p-2">{forum.creator}</td>
                  <td className="border border-gray-300 p-2">{forum.status}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(forum)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(forum.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">
            No forums available. Create a new forum to get started.
          </p>
        )}
      </div>
    </div>
  );
}
