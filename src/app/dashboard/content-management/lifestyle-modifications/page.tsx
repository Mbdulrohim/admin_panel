"use client";

import { useState, useEffect } from "react";

type Modification = {
  id?: number;
  title: string;
  content: string;
  image_url?: string;
  status: string; // SUBSCRIPTION OR FREE CONTENT
  pricing: string; // Free or Premium
};

export default function LifestyleModificationPage() {
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newModification, setNewModification] = useState<
    Modification & { file?: File | null }
  >({
    title: "",
    content: "",
    status: "Draft",
    pricing: "Free",
    file: null,
  });

  const [editingModification, setEditingModification] =
    useState<Modification | null>(null);

  useEffect(() => {
    fetch("/api/lifestyle-modifications")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch modifications");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setModifications(data);
        } else {
          console.error("Unexpected API response:", data);
          setModifications([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching modifications:", err);
        setError("Failed to load modifications. Please try again later.");
      });
  }, []);

  const handleInputChange = (field: keyof Modification, value: string) => {
    setNewModification((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setNewModification((prev) => ({ ...prev, file: files[0] }));
    }
  };

  const handleAddModification = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("title", newModification.title);
    formData.append("content", newModification.content);
    formData.append("status", newModification.status);
    formData.append("pricing", newModification.pricing); // Include pricing

    if (newModification.file) {
      formData.append("file", newModification.file);
    }

    try {
      const res = await fetch("/api/lifestyle-modifications", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error adding modification.");
        return;
      }

      const addedModification = await res.json();
      setModifications((prev) => [...prev, addedModification]);
      setSuccessMessage("Modification added successfully!");
      resetForm();
    } catch (err) {
      console.error("Error adding modification:", err);
      setError("Failed to add modification.");
    } finally {
      setLoading(false);
    }
  };
  const handlePricingChange = async (id: number, currentPricing: string) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Toggle pricing
      const newPricing = currentPricing === "Free" ? "Premium" : "Free";

      // Make the PUT request to update the pricing
      const res = await fetch("/api/lifestyle-modifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pricing: newPricing }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Failed to update pricing.");
        return;
      }

      const updatedModification = await res.json();

      // Update the local state with the new pricing
      setModifications((prev) =>
        prev.map((modification) =>
          modification.id === updatedModification.id
            ? updatedModification
            : modification
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

  const handleEdit = (modification: Modification) => {
    setEditingModification(modification);
    setNewModification({ ...modification, file: null });
  };

  const resetForm = () => {
    setNewModification({
      title: "",
      content: "",
      status: "Published",
      pricing: "Free",
      file: null,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingModification) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("id", editingModification.id!.toString());
    formData.append("title", newModification.title);
    formData.append("content", newModification.content);
    formData.append("status", newModification.status);
    formData.append("pricing", newModification.pricing); // Include pricing

    if (newModification.file) {
      formData.append("file", newModification.file);
    }

    try {
      const res = await fetch("/api/lifestyle-modifications", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error saving modification.");
        return;
      }

      const updatedModification = await res.json();
      setModifications((prev) =>
        prev.map((modification) =>
          modification.id === updatedModification.id
            ? updatedModification
            : modification
        )
      );
      setSuccessMessage("Modification updated successfully!");
      setEditingModification(null);
      resetForm();
    } catch (err) {
      console.error("Error saving modification:", err);
      setError("Failed to save modification.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/lifestyle-modifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error deleting modification.");
        return;
      }

      setModifications((prev) =>
        prev.filter((modification) => modification.id !== id)
      );
      setSuccessMessage("Modification deleted successfully!");
    } catch (err) {
      console.error("Error deleting modification:", err);
      setError("Failed to delete modification.");
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

      const res = await fetch("/api/lifestyle-modifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error updating status.");
        return;
      }

      const updatedModification = await res.json();
      setModifications((prev) =>
        prev.map((modification) =>
          modification.id === updatedModification.id
            ? updatedModification
            : modification
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
    totalModifications: modifications.length || 0,
    freeContent:
      modifications.filter((modification) => modification.status === "Free")
        .length || 0,
    premiumContent:
      modifications.filter(
        (modification) => modification.status === "Subscription"
      ).length || 0,
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Modifications
          </h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.totalModifications}
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Free Content</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {
              modifications.filter(
                (modification) => modification.pricing === "Free"
              ).length
            }
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Premium Content
          </h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {
              modifications.filter(
                (modification) => modification.pricing === "Premium"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Add/Edit Modification Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingModification ? "Edit Modification" : "Add a New Modification"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Modification Title
          </label>
          <input
            type="text"
            value={newModification.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="p-2 border border-gray-300 rounded-sm"
          />
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Modification Content
          </label>
          <textarea
            value={newModification.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
          <label
            htmlFor="pricing"
            className="block text-sm font-medium text-gray-700"
          >
            Pricing
          </label>
          <select
            value={newModification.pricing}
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
            onClick={
              editingModification ? handleSaveEdit : handleAddModification
            }
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {editingModification ? "Save Changes" : "Add Modification"}
          </button>
          {editingModification && (
            <button
              onClick={() => setEditingModification(null)}
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

      {/* Modification List Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Modification List
        </h2>
        {modifications.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Title</th>
                <th className="border border-gray-300 p-2 text-left">
                  Content
                </th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">
                  Pricing
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Pricing
                </th>
                <th className="border border-gray-300 p-2 text-left">Image</th>
                <th className="border border-gray-300 p-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {modifications.map((modification) => (
                <tr
                  key={
                    modification.id ||
                    `${modification.title}-${modification.content}`
                  }
                >
                  <td className="border border-gray-300 p-2">
                    {modification.id}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {modification.title}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {modification.content.length > 80
                      ? `${modification.content.substring(0, 80)}...`
                      : modification.content}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {modification.status}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {modification.pricing}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() =>
                        handlePricingChange(
                          modification.id!,
                          modification.pricing
                        )
                      }
                      className={`px-3 py-1 rounded ${
                        modification.pricing === "Free"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                    >
                      {modification.pricing === "Free"
                        ? "Switch to Premium"
                        : "Switch to Free"}
                    </button>
                  </td>

                  <td className="border border-gray-300 p-2">
                    {modification.image_url ? (
                      <img
                        src={modification.image_url}
                        alt={`${modification.title}`}
                        className="w-16 h-16 object-cover inline-block rounded-sm"
                      />
                    ) : (
                      <span className="text-gray-500">No image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(modification)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          modification.id!,
                          modification.status
                        )
                      }
                      className={`px-3 py-1 rounded mr-2 ${
                        modification.status === "Published"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      {modification.status === "Published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(modification.id!)}
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
            No modifications available. Add a new modification to get started.
          </p>
        )}
      </div>
    </div>
  );
}
