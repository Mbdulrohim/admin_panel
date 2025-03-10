"use client";

import { useState, useEffect } from "react";

type Plant = {
  id?: number;
  name: string;
  profile: string;
  medicinal_properties: string;
  side_effects: string;
  recipes: string;
  image_url?: string;
  status: string;
};

export default function MedicinalPlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]); // Set type to Plant[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newPlant, setNewPlant] = useState<Plant & { file?: File | null }>({
    name: "",
    profile: "",
    medicinal_properties: "",
    side_effects: "",
    recipes: "",
    status: "Published",
    file: null,
  });

  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  useEffect(() => {
    fetch("/api/medicinal-plants")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch plants");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPlants(data); // This will now work correctly
        } else {
          console.log("Unexpected API response:", data);
          setPlants([]); // Reset plants to an empty array on unexpected response
        }
      })
      .catch((err) => {
        console.log("Error fetching plants:", err);
        setError("Failed to load plants. Please try again later.");
      });
  }, []);

  const handleInputChange = (field: keyof Plant, value: string) => {
    setNewPlant((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setNewPlant((prev) => ({ ...prev, file: files[0] })); // Only handle one file
    }
  };

  const handleAddPlant = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("name", newPlant.name);
    formData.append("profile", newPlant.profile);
    formData.append("medicinal_properties", newPlant.medicinal_properties);
    formData.append("side_effects", newPlant.side_effects);
    formData.append("recipes", newPlant.recipes);
    formData.append("status", newPlant.status);

    if (newPlant.file) {
      formData.append("file", newPlant.file); // Add the file
    }

    try {
      const res = await fetch("/api/medicinal-plants", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error adding plant.");
        return;
      }

      const addedPlant = await res.json();
      setPlants((prev) => [...prev, addedPlant]);
      setSuccessMessage("Plant added successfully!");
      setNewPlant({
        name: "",
        profile: "",
        medicinal_properties: "",
        side_effects: "",
        recipes: "",
        status: "Published",
        file: null,
      });
      resetForm();
    } catch (err) {
      console.log("Error adding plant:", err);
      setError("Failed to add plant.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setNewPlant({ ...plant, file: null }); // Reset file when editing
  };

  const resetForm = () => {
    setNewPlant({
      name: "",
      profile: "",
      medicinal_properties: "",
      side_effects: "",
      recipes: "",
      status: "Published",
      file: null,
    });
  };
  const handleSaveEdit = async () => {
    if (!editingPlant) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("id", editingPlant.id!.toString());
    formData.append("name", newPlant.name);
    formData.append("profile", newPlant.profile);
    formData.append("medicinal_properties", newPlant.medicinal_properties);
    formData.append("side_effects", newPlant.side_effects);
    formData.append("recipes", newPlant.recipes);
    formData.append("status", newPlant.status);

    if (newPlant.file) {
      formData.append("file", newPlant.file); // Add the file if it exists
    }

    try {
      const res = await fetch("/api/medicinal-plants", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error saving plant.");
        return;
      }

      const updatedPlant = await res.json();
      setPlants((prev) =>
        prev.map((plant) =>
          plant.id === updatedPlant.id ? updatedPlant : plant
        )
      );
      setSuccessMessage("Plant updated successfully!");
      setEditingPlant(null);
      resetForm();
    } catch (err) {
      console.log(`Error saving plant: ${err}`, err);
      setError("Failed to save plant.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/medicinal-plants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error deleting plant.");
        return;
      }

      setPlants((prev) => prev.filter((plant) => plant.id !== id));
      setSuccessMessage("Plant deleted successfully!");
    } catch (err) {
      console.log("Error deleting plant:", err);
      setError("Failed to delete plant.");
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

      const res = await fetch("/api/medicinal-plants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error updating status.");
        return;
      }

      const updatedPlant = await res.json();
      setPlants((prev) =>
        prev.map((plant) =>
          plant.id === updatedPlant.id ? updatedPlant : plant
        )
      );
      setSuccessMessage(`Status changed to "${newStatus}" successfully!`);
    } catch (err) {
      console.log("Error updating status:", err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analytics = {
    totalPlants: plants.length || 0,
    freeContent:
      plants.filter((plant) => plant.status === "Published").length || 0,
    premiumContent: plants.filter((plant) => plant.recipes).length || 0,
    topReadPlant: plants[0]?.name || "None",
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Total Plants</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.totalPlants}
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
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Top Read Plant
          </h2>
          <p className="text-lg text-green-800 mt-2">
            {analytics.topReadPlant}
          </p>
        </div>
      </div>

      {/* Add/Edit Plant Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingPlant ? "Edit Plant" : "Add a New Plant"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Plant Name
          </label>
          <input
            type="text"
            value={newPlant.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Plant Name"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <label
            htmlFor="profile"
            className="block text-sm font-medium text-gray-700"
          >
            Plant Profile (incl. scientific name)
          </label>
          <textarea
            value={newPlant.profile}
            onChange={(e) => handleInputChange("profile", e.target.value)}
            placeholder="Plant Profile (incl. scientific name)"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <label
            htmlFor="profile"
            className="block text-sm font-medium text-gray-700"
          >
            Medicinal Properties
          </label>
          <textarea
            value={newPlant.medicinal_properties}
            onChange={(e) =>
              handleInputChange("medicinal_properties", e.target.value)
            }
            placeholder="Medicinal Properties"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <label
            htmlFor="profile"
            className="block text-sm font-medium text-gray-700"
          >
            Side Effects & Warnings
          </label>
          <textarea
            value={newPlant.side_effects}
            onChange={(e) => handleInputChange("side_effects", e.target.value)}
            placeholder="Side Effects & Warnings"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <label
            htmlFor="recipes"
            className="block text-sm font-medium text-gray-700"
          >
            Recipes & DIY Remedies (Subscription)
          </label>
          <textarea
            value={newPlant.recipes}
            onChange={(e) => handleInputChange("recipes", e.target.value)}
            placeholder="Recipes & DIY Remedies (Subscription)"
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          ></textarea>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
        </div>
        <div className="flex items-center mt-4">
          <button
            onClick={editingPlant ? handleSaveEdit : handleAddPlant}
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {editingPlant ? "Save Changes" : "Add Plant"}
          </button>
          {editingPlant && (
            <button
              onClick={() => setEditingPlant(null)}
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

      {/* Plant List Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Plant List</h2>
        {plants.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">
                  Profile
                </th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Photo</th>
                <th className="border border-gray-300 p-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {plants.map((plant) => (
                <tr key={plant.id || `${plant.name}-${plant.profile}`}>
                  <td className="border border-gray-300 p-2">{plant.id}</td>
                  <td className="border border-gray-300 p-2">{plant.name}</td>
                  <td className="border border-gray-300 p-2">
                    {plant.profile.length > 80
                      ? `${plant.profile.substring(0, 80)}...`
                      : plant.profile}
                  </td>

                  <td className="border border-gray-300 p-2">{plant.status}</td>
                  <td className="border border-gray-300 p-2">
                    {plant.image_url ? (
                      <div className="relative w-16 h-16">
                        <img
                          src={plant.image_url}
                          alt={`${plant.name}`}
                          className="w-16 h-16 object-cover inline-block rounded-sm"
                          onLoad={(e) => {
                            e.currentTarget.style.opacity = "1";
                          }}
                          style={{
                            opacity: "0",
                            transition: "opacity 0.3s ease",
                          }}
                        />
                        {/* <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-sm animate-pulse">
                          <span>Loading...</span>
                        </div> */}
                      </div>
                    ) : (
                      <span className="text-gray-500">No photo</span>
                    )}
                  </td>

                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(plant)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(plant.id!, plant.status)
                      }
                      className={`px-3 py-1 rounded mr-2 ${
                        plant.status === "Published"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      {plant.status === "Published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(plant.id!)}
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
            No plants available. Add a new plant to get started.
          </p>
        )}
      </div>
    </div>
  );
}
