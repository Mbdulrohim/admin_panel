"use client";

import { useState, useEffect } from "react";

type MarriageAndSexMatter = {
  id?: number;
  title: string;
  content: string;
  image_url?: string;
  status: string; // Draft or Published
  pricing: string; // Free or Premium
};

export default function MarriageAndSexMattersPage() {
  const [matters, setMatters] = useState<MarriageAndSexMatter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newMatter, setNewMatter] = useState<
    MarriageAndSexMatter & { file?: File | null }
  >({
    title: "",
    content: "",
    status: "Draft",
    pricing: "Free",
    file: null,
  });

  const [editingMatter, setEditingMatter] = useState<MarriageAndSexMatter | null>(null);

  useEffect(() => {
    fetch("/api/marriage-and-sex-matters")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch matters");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setMatters(data);
        } else {
          console.error("Unexpected API response:", data);
          setMatters([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching matters:", err);
        setError("Failed to load matters. Please try again later.");
      });
  }, []);

  const handleInputChange = (field: keyof MarriageAndSexMatter, value: string) => {
    setNewMatter((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setNewMatter((prev) => ({ ...prev, file: files[0] }));
    }
  };

  const handleAddMatter = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("title", newMatter.title);
    formData.append("content", newMatter.content);
    formData.append("status", newMatter.status);
    formData.append("pricing", newMatter.pricing);

    if (newMatter.file) {
      formData.append("file", newMatter.file);
    }

    try {
      const res = await fetch("/api/marriage-and-sex-matters", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error adding matter.");
        return;
      }

      const addedMatter = await res.json();
      setMatters((prev) => [...prev, addedMatter]);
      setSuccessMessage("Matter added successfully!");
      resetForm();
    } catch (err) {
      console.error("Error adding matter:", err);
      setError("Failed to add matter.");
    } finally {
      setLoading(false);
    }
  };

  const handlePricingChange = async (id: number, currentPricing: string) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const newPricing = currentPricing === "Free" ? "Premium" : "Free";

      const res = await fetch("/api/marriage-and-sex-matters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pricing: newPricing }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Failed to update pricing.");
        return;
      }

      const updatedMatter = await res.json();

      setMatters((prev) =>
        prev.map((matter) =>
          matter.id === updatedMatter.id ? updatedMatter : matter
        )
      );
      setSuccessMessage(`Pricing changed to "${newPricing}" successfully!`);
    } catch (err) {
      console.error("Error updating pricing:", err);
      setError("Failed to update pricing.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (matter: MarriageAndSexMatter) => {
    setEditingMatter(matter);
    setNewMatter({ ...matter, file: null });
  };

  const resetForm = () => {
    setNewMatter({
      title: "",
      content: "",
      status: "Draft",
      pricing: "Free",
      file: null,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMatter) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("id", editingMatter.id!.toString());
    formData.append("title", newMatter.title);
    formData.append("content", newMatter.content);
    formData.append("status", newMatter.status);
    formData.append("pricing", newMatter.pricing);

    if (newMatter.file) {
      formData.append("file", newMatter.file);
    }

    try {
      const res = await fetch("/api/marriage-and-sex-matters", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error saving matter.");
        return;
      }

      const updatedMatter = await res.json();
      setMatters((prev) =>
        prev.map((matter) =>
          matter.id === updatedMatter.id ? updatedMatter : matter
        )
      );
      setSuccessMessage("Matter updated successfully!");
      setEditingMatter(null);
      resetForm();
    } catch (err) {
      console.error("Error saving matter:", err);
      setError("Failed to save matter.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/marriage-and-sex-matters", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error deleting matter.");
        return;
      }

      setMatters((prev) => prev.filter((matter) => matter.id !== id));
      setSuccessMessage("Matter deleted successfully!");
    } catch (err) {
      console.error("Error deleting matter:", err);
      setError("Failed to delete matter.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const newStatus = currentStatus === "Published" ? "Draft" : "Published";

      const res = await fetch("/api/marriage-and-sex-matters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error updating status.");
        return;
      }

      const updatedMatter = await res.json();
      setMatters((prev) =>
        prev.map((matter) =>
          matter.id === updatedMatter.id ? updatedMatter : matter
        )
      );
      setSuccessMessage(`Status changed to "${newStatus}" successfully!`);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analytics = {
    totalMatters: matters.length || 0,
    freeContent: matters.filter((matter) => matter.pricing === "Free").length,
    premiumContent: matters.filter((matter) => matter.pricing === "Premium")
      .length,
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Matters
          </h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.totalMatters}
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Free Content</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.freeContent}
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Premium Content
          </h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.premiumContent}
          </p>
        </div>
      </div>

      {/* Add/Edit Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingMatter ? "Edit Matter" : "Add a New Matter"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Matter Title
          </label>
          <input
            type="text"
            value={newMatter.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="p-2 border border-gray-300 rounded-sm"
          />
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Matter Content
          </label>
          <textarea
            value={newMatter.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
          <label htmlFor="pricing" className="block text-sm font-medium text-gray-700">
            Pricing
          </label>
          <select
            value={newMatter.pricing}
            onChange={(e) => handleInputChange("pricing", e.target.value)}
            className="p-2 border border-gray-300 rounded-sm"
          >
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
        </div>
        <div className="flex items-center mt-4">
          <button
            onClick={editingMatter ? handleSaveEdit : handleAddMatter}
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {editingMatter ? "Save Changes" : "Add Matter"}
          </button>
          {editingMatter && (
            <button
              onClick={() => setEditingMatter(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-sm ml-2 hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-500 text-white p-2 rounded-sm mb-4">{error}</div>
      )}
      {successMessage && (
        <div className="bg-green-500 text-white p-2 rounded-sm mb-4">
          {successMessage}
        </div>
      )}

      {/* Matter List Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Matter List
        </h2>
        {matters.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Title</th>
                <th className="border border-gray-300 p-2 text-left">Content</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Pricing</th><th className="border border-gray-300 p-2 text-left">
                  Pricing Status
                </th>
                <th className="border border-gray-300 p-2 text-left">Image</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matters.map((matter) => (
                <tr key={matter.id || `${matter.title}-${matter.content}`}>
                  <td className="border border-gray-300 p-2">{matter.id}</td>
                  <td className="border border-gray-300 p-2">{matter.title}</td>
                  <td className="border border-gray-300 p-2">
                    {matter.content.length > 80
                      ? `${matter.content.substring(0, 80)}...`
                      : matter.content}
                  </td>
                  <td className="border border-gray-300 p-2">{matter.status}</td>
                  <td className="border border-gray-300 p-2">
                    {matter.pricing}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() =>
                        handlePricingChange(matter.id!, matter.pricing)
                      }
                      className={`px-3 py-1 rounded ${
                        matter.pricing === "Free"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                    >
                      {matter.pricing === "Free"
                        ? "Switch to Premium"
                        : "Switch to Free"}
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {matter.image_url ? (
                      <img
                        src={matter.image_url}
                        alt={`${matter.title}`}
                        className="w-16 h-16 object-cover inline-block rounded-sm"
                      />
                    ) : (
                      <span className="text-gray-500">No image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(matter)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(matter.id!, matter.status)
                      }
                      className={`px-3 py-1 rounded mr-2 ${
                        matter.status === "Published"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      {matter.status === "Published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(matter.id!)}
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
          <p className="text-gray-600 text-center">
            No matters available. Add a new matter to get started.
          </p>
        )}
      </div>
    </div>
  );
}
