"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Disease = {
  id?: number;
  name: string;
  profile: string;
  diagnosis: string;
  prevention: string;
  conventional_treatment: string,
  naturopathic_treatment:string,
  image_url?: string;
  status: string
};
export default function DiseaseManagementPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newDisease, setNewDisease] = useState<Omit<Disease, "id" | "image_url"> & { file: File | null }>({
    name: "",
    profile: "",
    diagnosis: "",
    prevention: "",
    conventional_treatment: "",
    naturopathic_treatment: "",
    status: "Published",
    file: null,
  });
  

  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);


  useEffect(() => {
    fetch("/api/diseases")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch diseases");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDiseases(data);
        } else {
          console.error("Unexpected API response:", data);
          setDiseases([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching diseases:", err);
        setError("Failed to load diseases. Please try again later.");
      });
  }, []);
  
  const handleInputChange = (field: keyof Disease, value: string) => {
    setNewDisease((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setNewDisease((prev) => ({ ...prev, file: files[0] })); // Only handle one file
    }
  };
  const handleAddDisease = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("name", newDisease.name);
    formData.append("profile", newDisease.profile);
    formData.append("diagnosis", newDisease.diagnosis);
    formData.append("prevention", newDisease.prevention);
    formData.append("conventional_treatment", newDisease.conventional_treatment);
    formData.append("naturopathic_treatment", newDisease.naturopathic_treatment);
    formData.append("status", newDisease.status);

    if (newDisease.file) {
      formData.append("file", newDisease.file); // Add the file
    }

    try {
      const res = await fetch("/api/diseases", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error adding disease.");
        return;
      }

      const addedDisease = await res.json();
      setDiseases((prev) => [...prev, addedDisease]);
      setSuccessMessage("Disease added successfully!");
      setNewDisease({
        name: "",
        profile: "",
        diagnosis: "",
        prevention: "",
        conventional_treatment: "",
        naturopathic_treatment: "",
        status: "Published",
        file: null,
      });
    } catch (err) {
      console.error("Error adding disease:", err);
      setError("Failed to add disease.");
    } finally {
      setLoading(false);
    }
  };

  
  const resetForm = () => {
    setNewDisease({
      name: "",
      profile: "",
      diagnosis: "",
      prevention: "",
      conventional_treatment: "",
      naturopathic_treatment: "",
      file: null,
      status: "Published",
    });
  };

  const handleEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setNewDisease({ ...disease, file: null });
  };

  const handleSaveEdit = async () => {
    if (!editingDisease) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("id", editingDisease.id!.toString());
    formData.append("name", newDisease.name);
    formData.append("profile", newDisease.profile);
    formData.append("diagnosis", newDisease.diagnosis);
    formData.append("prevention", newDisease.prevention);
    formData.append("conventional_treatment", newDisease.conventional_treatment);
    formData.append("naturopathic_treatment", newDisease.naturopathic_treatment);
    formData.append("status", newDisease.status);

    if (newDisease.file) {
      formData.append("file", newDisease.file); // Add the file if it exists
    }

    try {
      const res = await fetch("/api/diseases", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error saving disease.");
        return;
      }

      const updatedDisease = await res.json();
      setDiseases((prev) =>
        prev.map((disease) =>
          disease.id === updatedDisease.id ? updatedDisease : disease
        )
      );
      setSuccessMessage("Disease updated successfully!");
      setEditingDisease(null);
      resetForm()
    } catch (err) {
      console.error(`Error saving disease: ${err}`, err);
      setError("Failed to save disease.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/diseases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error deleting disease.");
        return;
      }

      setDiseases((prev) => prev.filter((disease) => disease.id !== id));
      setSuccessMessage("Disease deleted successfully!");
    } catch (err) {
      console.error("Error deleting disease:", err);
      setError("Failed to delete disease.");
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

      const res = await fetch("/api/diseases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error updating status.");
        return;
      }

      const updatedDisease = await res.json();
      setDiseases((prev) =>
        prev.map((disease) =>
          disease.id === updatedDisease.id ? updatedDisease : disease
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
    totalDiseases: diseases.length || 0,
    freeContent:
      diseases.filter((disease) => disease.status === "Published").length || 0,
    premiumContent: diseases.filter((disease) => disease.conventional_treatment).length || 0,
    topReadDisease: diseases[0]?.name || "None",
  };


  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Total Diseases</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.totalDiseases}
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Free Content</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.freeContent}
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Premium Content</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.premiumContent}
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Top Read Disease</h2>
          <p className="text-lg text-green-800 mt-2">{analytics.topReadDisease}</p>
        </div>
      </div>
  
      {/* Add/Edit Disease Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingDisease ? "Edit Disease" : "Add a New Disease"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">Disease Name</label>
          <input
            type="text"
            value={newDisease.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Disease Name"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <label className="block text-sm font-medium text-gray-700">Disease Profile</label>
          <textarea
            value={newDisease.profile}
            onChange={(e) => handleInputChange("profile", e.target.value)}
            placeholder="Disease Profile"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
          <textarea
            value={newDisease.diagnosis}
            onChange={(e) => handleInputChange("diagnosis", e.target.value)}
            placeholder="Diagnosis"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <label className="block text-sm font-medium text-gray-700">Prevention</label>
          <textarea
            value={newDisease.prevention}
            onChange={(e) => handleInputChange("prevention", e.target.value)}
            placeholder="Prevention"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <label className="block text-sm font-medium text-gray-700">
            Conventional Treatment
          </label>
          <textarea
            value={newDisease.conventional_treatment}
            onChange={(e) =>
              handleInputChange("conventional_treatment", e.target.value)
            }
            placeholder="Conventional Treatment"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <label className="block text-sm font-medium text-gray-700">
            Naturopathic Treatment
          </label>
          <textarea
            value={newDisease.naturopathic_treatment}
            onChange={(e) =>
              handleInputChange("naturopathic_treatment", e.target.value)
            }
            placeholder="Naturopathic Treatment"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
        </div>
        <div className="flex items-center mt-4">
          <button
            onClick={editingDisease ? handleSaveEdit : handleAddDisease}
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {editingDisease ? "Save Changes" : "Add Disease"}
          </button>
          {editingDisease && (
            <button
              onClick={() => setEditingDisease(null)}
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
  
      {/* Disease List Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Disease List</h2>
        {diseases.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Profile</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Photo</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((disease) => (
                <tr key={disease.id}>
                  <td className="border border-gray-300 p-2">{disease.id}</td>
                  <td className="border border-gray-300 p-2">{disease.name}</td>
                  <td className="border border-gray-300 p-2">
  {disease.profile.length > 80
    ? `${disease.profile.substring(0, 80)}...` 
    : disease.profile}
</td>
                  <td className="border border-gray-300 p-2">{disease.status}</td>
                  <td className="border border-gray-300 p-2">
                    {disease.image_url ? (
                      <img
                        src={disease.image_url}
                        alt={`${disease.name}`}
                        className="w-16 h-16 object-cover rounded-sm"
                      />
                    ) : (
                      <span className="text-gray-500">No photo</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(disease)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(disease.id!, disease.status)
                      }
                      className={`px-3 py-1 rounded mr-2 ${
                        disease.status === "Published"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      {disease.status === "Published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(disease.id!)}
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
            No diseases available. Add a new disease to get started.
          </p>
        )}
      </div>
    </div>
  );
  
}
