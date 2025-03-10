"use client";

import { useState, useEffect } from "react";

type PregnancyAndChildCare = {
  id?: number;
  title: string;
  content: string;
  image_url?: string;
  status: string; // Draft or Published
  pricing: string; // Free or Premium
};

export default function PregnancyAndChildCarePage() {
  const [records, setRecords] = useState<PregnancyAndChildCare[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newRecord, setNewRecord] = useState<
    PregnancyAndChildCare & { file?: File | null }
  >({
    title: "",
    content: "",
    status: "Draft",
    pricing: "Free",
    file: null,
  });

  const [editingRecord, setEditingRecord] =
    useState<PregnancyAndChildCare | null>(null);

  useEffect(() => {
    fetch("/api/pregnancy-and-child-care")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch records");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          console.error("Unexpected API response:", data);
          setRecords([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching records:", err);
        setError("Failed to load records. Please try again later.");
      });
  }, []);

  const handleInputChange = (field: keyof PregnancyAndChildCare, value: string) => {
    setNewRecord((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setNewRecord((prev) => ({ ...prev, file: files[0] }));
    }
  };

  const handleAddRecord = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("title", newRecord.title);
    formData.append("content", newRecord.content);
    formData.append("status", newRecord.status);
    formData.append("pricing", newRecord.pricing);

    if (newRecord.file) {
      formData.append("file", newRecord.file);
    }

    try {
      const res = await fetch("/api/pregnancy-and-child-care", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error adding record.");
        return;
      }

      const addedRecord = await res.json();
      setRecords((prev) => [...prev, addedRecord]);
      setSuccessMessage("Record added successfully!");
      resetForm();
    } catch (err) {
      console.error("Error adding record:", err);
      setError("Failed to add record.");
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

      const res = await fetch("/api/pregnancy-and-child-care", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pricing: newPricing }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Failed to update pricing.");
        return;
      }

      const updatedRecord = await res.json();

      setRecords((prev) =>
        prev.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
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

  const handleEdit = (record: PregnancyAndChildCare) => {
    setEditingRecord(record);
    setNewRecord({ ...record, file: null });
  };

  const resetForm = () => {
    setNewRecord({
      title: "",
      content: "",
      status: "Draft",
      pricing: "Free",
      file: null,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("id", editingRecord.id!.toString());
    formData.append("title", newRecord.title);
    formData.append("content", newRecord.content);
    formData.append("status", newRecord.status);
    formData.append("pricing", newRecord.pricing);

    if (newRecord.file) {
      formData.append("file", newRecord.file);
    }

    try {
      const res = await fetch("/api/pregnancy-and-child-care", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error saving record.");
        return;
      }

      const updatedRecord = await res.json();
      setRecords((prev) =>
        prev.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
        )
      );
      setSuccessMessage("Record updated successfully!");
      setEditingRecord(null);
      resetForm();
    } catch (err) {
      console.error("Error saving record:", err);
      setError("Failed to save record.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/pregnancy-and-child-care", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error deleting record.");
        return;
      }

      setRecords((prev) => prev.filter((record) => record.id !== id));
      setSuccessMessage("Record deleted successfully!");
    } catch (err) {
      console.error("Error deleting record:", err);
      setError("Failed to delete record.");
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

      const res = await fetch("/api/pregnancy-and-child-care", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error updating status.");
        return;
      }

      const updatedRecord = await res.json();
      setRecords((prev) =>
        prev.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
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
    totalRecords: records.length || 0,
    freeContent: records.filter((record) => record.pricing === "Free").length,
    premiumContent: records.filter((record) => record.pricing === "Premium")
      .length,
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Records
          </h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.totalRecords}
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
          {editingRecord ? "Edit Record" : "Add a New Record"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Record Title
          </label>
          <input
            type="text"
            value={newRecord.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="p-2 border border-gray-300 rounded-sm"
          />
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Record Content
          </label>
          <textarea
            value={newRecord.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
          <label htmlFor="pricing" className="block text-sm font-medium text-gray-700">
            Pricing
          </label>
          <select
            value={newRecord.pricing}
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
            onClick={editingRecord ? handleSaveEdit : handleAddRecord}
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {editingRecord ? "Save Changes" : "Add Record"}
          </button>
          {editingRecord && (
            <button
              onClick={() => setEditingRecord(null)}
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

      {/* Record List Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Record List
        </h2>
        {records.length > 0 ? (
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
                <th className="border border-gray-300 p-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id || `${record.title}-${record.content}`}>
                  <td className="border border-gray-300 p-2">{record.id}</td>
                  <td className="border border-gray-300 p-2">{record.title}</td>
                  <td className="border border-gray-300 p-2">
                    {record.content.length > 80
                      ? `${record.content.substring(0, 80)}...`
                      : record.content}
                  </td>
                  <td className="border border-gray-300 p-2">{record.status}</td>
                  <td className="border border-gray-300 p-2">
                    {record.pricing}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() =>
                        handlePricingChange(record.id!, record.pricing)
                      }
                      className={`px-3 py-1 rounded ${
                        record.pricing === "Free"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                    >
                      {record.pricing === "Free"
                        ? "Switch to Premium"
                        : "Switch to Free"}
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {record.image_url ? (
                      <img
                        src={record.image_url}
                        alt={`${record.title}`}
                        className="w-16 h-16 object-cover inline-block rounded-sm"
                      />
                    ) : (
                      <span className="text-gray-500">No image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(record.id!, record.status)
                      }
                      className={`px-3 py-1 rounded mr-2 ${
                        record.status === "Published"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      {record.status === "Published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(record.id!)}
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
            No records available. Add a new record to get started.
          </p>
        )}
      </div>
    </div>
  );
}
