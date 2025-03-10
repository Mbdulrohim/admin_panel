"use client";

import { useState, useEffect } from "react";

type Drug = {
  id?: number;
  name: string;
  category_id: number | null;
  profile: string;
  uses: string;
  interactions: string;
  side_effects: string;
  dosage: string;
  brand_names: string;
  patient_advice: string;
  additional_notes: string;
  image_url?: string; // For signed image URL
  status: string;
};

type Category = {
  id: number;
  name: string;
};

export default function DrugsPage() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null); // For filtering drugs by category
  const [newCategory, setNewCategory] = useState("");
  const [newDrug, setNewDrug] = useState<Drug & { file?: File | null }>({
    name: "",
    category_id: null,
    profile: "",
    uses: "",
    interactions: "",
    side_effects: "",
    dosage: "",
    brand_names: "",
    patient_advice: "",
    additional_notes: "",
    status: "Draft",
    file: null,
  });

  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/drugs")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch drugs");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDrugs(data);
        } else {
          console.error("Unexpected API response:", data);
          setDrugs([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching drugs:", err);
        setError("Failed to load drugs. Please try again later.");
      });

    fetch("/api/drugs/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected API response:", data);
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      });
  }, []);
  const handleInputChange = (field: keyof Drug, value: string) => {
    setNewDrug((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setNewDrug((prev) => ({ ...prev, file: files[0] })); // Handle one file
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") {
      setError("Category name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/drugs/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Failed to add category.");
        return;
      }

      const addedCategory = await res.json();
      setCategories((prev) => [...prev, addedCategory]);
      setSuccessMessage("Category added successfully!");
      setNewCategory("");
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (drug: Drug) => {
    setEditingDrug(drug);
    setNewDrug({ ...drug, file: null });
  };
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/drugs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error deleting drug.");
        return;
      }

      setDrugs((prev) => prev.filter((drug) => drug.id !== id));
      setSuccessMessage("Drug deleted successfully!");
    } catch (err) {
      console.error("Error deleting drug:", err);
      setError("Failed to delete drug.");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveEdit = async () => {
    if (!editingDrug) {
      setError("No drug selected for editing.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();

      formData.append("id", editingDrug.id!.toString());
      if (newDrug.name) formData.append("name", newDrug.name);
      if (newDrug.profile) formData.append("profile", newDrug.profile);
      if (newDrug.uses) formData.append("uses", newDrug.uses);
      if (newDrug.interactions)
        formData.append("interactions", newDrug.interactions);
      if (newDrug.side_effects)
        formData.append("side_effects", newDrug.side_effects);
      if (newDrug.dosage) formData.append("dosage", newDrug.dosage);
      if (newDrug.status) formData.append("status", newDrug.status);
      if (newDrug.category_id !== null) {
        formData.append("category_id", newDrug.category_id.toString());
      }
      

      if (newDrug.file) {
        formData.append("file", newDrug.file);
      }

      console.log("Sending FormData:", Object.fromEntries(formData.entries()));

      const response = await fetch("/api/drugs", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error(errorData.error || "Failed to update drug");
      }

      const updatedDrug = await response.json();
      console.log("Updated Drug Response:", updatedDrug);

      setDrugs((prev) =>
        prev.map((drug) => (drug.id === updatedDrug.id ? updatedDrug : drug))
      );

      setSuccessMessage("Drug updated successfully!");
      setEditingDrug(null);
    } catch (err) {
      console.error("Error updating drug:");
      setError(`${err} ` || "Failed to update drug. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const newStatus = currentStatus === "Published" ? "Draft" : "Published";

      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("status", newStatus);

      const res = await fetch("/api/drugs", {
        method: "PUT",
        body: formData, // Use FormData here
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.message || "Error updating status.");
        return;
      }

      const updatedDrug = await res.json();
      setDrugs((prev) =>
        prev.map((drug) => (drug.id === updatedDrug.id ? updatedDrug : drug))
      );
      setSuccessMessage(`Status updated to "${newStatus}" successfully!`);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDrug = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("name", newDrug.name);
    if (newDrug.category_id !== null) {
      formData.append("category_id", newDrug.category_id.toString());
    }

    formData.append("profile", newDrug.profile);
    formData.append("uses", newDrug.uses);
    formData.append("interactions", newDrug.interactions);
    formData.append("side_effects", newDrug.side_effects);
    formData.append("dosage", newDrug.dosage);
    formData.append("brand_names", newDrug.brand_names || "");
    formData.append("patient_advice", newDrug.patient_advice || "");
    formData.append("brand_names", newDrug.brand_names|| ""); // Include brand names
    formData.append("patient_advice", newDrug.patient_advice|| ""); // Include patient advice

    formData.append("status", newDrug.status);

    if (newDrug.file) {
      formData.append("file", newDrug.file); // Ensure file is appended
    }

    console.log("Sending FormData:", Array.from(formData.entries())); // Debug form data

    try {
      const res = await fetch("/api/drugs", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error adding drug:", error);
        setError(error.message || "Failed to add drug.");
        return;
      }

      const newDrugResponse = await res.json();
      console.log("New Drug Added:", newDrugResponse);

      setDrugs((prev) => [...prev, newDrugResponse]);
      setSuccessMessage("Drug added successfully!");
      setNewDrug({
        name: "",
        category_id: null,
        profile: "",
        uses: "",
        interactions: "",
        side_effects: "",
        dosage: "",
        brand_names: "",
        patient_advice: "",
        additional_notes: "",
        file: null,
        status: "Draft",
      });
    } catch (err) {
      console.error("Error adding drug:", err);
      setError("Failed to add drug.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
  };

  const filteredDrugs = activeCategory
    ? drugs.filter((drug) => drug.category_id === activeCategory)
    : drugs;

  const analytics = {
    totalDrugs: drugs.length || 0,
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Total Drugs</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {analytics.totalDrugs}
          </p>
        </div>
      </div>

      {/* Add/Edit Drug Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingDrug ? "Edit Drug" : "Add a New Drug"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Drug Name
          </label>
          <input
            type="text"
            value={newDrug.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Drug Name"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <label
            htmlFor="brandNames"
            className="block text-sm font-medium text-gray-700"
          >
            Brand Names
          </label>
          <input
            type="text"
            value={newDrug.brand_names}
            onChange={(e) => handleInputChange("brand_names", e.target.value)}
            placeholder="Enter Brand Names"
            className="p-2 border border-gray-300 rounded-sm"
          />

          <label
            htmlFor="uses"
            className="block text-sm font-medium text-gray-700"
          >
            Drug Uses
          </label>
          <textarea
            value={newDrug.uses}
            onChange={(e) => handleInputChange("uses", e.target.value)}
            placeholder="Enter Drug Uses"
            className="p-2 border border-gray-300 rounded-sm"
          ></textarea>

          <label
            htmlFor="profile"
            className="block text-sm font-medium text-gray-700"
          >
            Drug Profile
          </label>
          <textarea
            value={newDrug.profile}
            onChange={(e) => handleInputChange("profile", e.target.value)}
            placeholder="Enter Drug Profile"
            className="p-2 border border-gray-300 rounded-sm"
          ></textarea>

          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            value={newDrug.category_id || ""}
            onChange={(e) =>
              handleInputChange(
                "category_id",
                parseInt(e.target.value).toString()
              )
            }
            className="p-2 border border-gray-300 rounded-sm"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label
            htmlFor="sideEffects"
            className="block text-sm font-medium text-gray-700"
          >
            Side Effects & Precautions
          </label>
          <textarea
            value={newDrug.side_effects}
            onChange={(e) => handleInputChange("side_effects", e.target.value)}
            placeholder="Enter Side Effects & Precautions"
            className="p-2 border border-gray-300 rounded-sm"
          ></textarea>

          <label
            htmlFor="interactions"
            className="block text-sm font-medium text-gray-700"
          >
            Interactions & Contraindications
          </label>
          <textarea
            value={newDrug.interactions}
            onChange={(e) => handleInputChange("interactions", e.target.value)}
            placeholder="Enter Interactions & Contraindications"
            className="p-2 border border-gray-300 rounded-sm"
          ></textarea>

          <label
            htmlFor="dosage"
            className="block text-sm font-medium text-gray-700"
          >
            Dosage Information
          </label>
          <textarea
            value={newDrug.dosage}
            onChange={(e) => handleInputChange("dosage", e.target.value)}
            placeholder="Enter Dosage Information"
            className="p-2 border border-gray-300 rounded-sm"
          ></textarea>
          <label
            htmlFor="patientAdvice"
            className="block text-sm font-medium text-gray-700"
          >
            Patient Advice
          </label>
          <textarea
            value={newDrug.patient_advice}
            onChange={(e) =>
              handleInputChange("patient_advice", e.target.value)
            }
            placeholder="Enter Patient Advice"
            className="p-2 border border-gray-300 rounded-sm"
          />

          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Drug Image
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
        </div>
        <button
          onClick={editingDrug ? handleSaveEdit : handleAddDrug}
          className="bg-green-600 text-white px-4 py-2 rounded-sm mt-4 hover:bg-green-700"
        >
          {editingDrug ? "Save Changes" : "Add Drug"}
        </button>
        {editingDrug && (
          <button
            onClick={() => setEditingDrug(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-sm mt-4 ml-2 hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
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

      {/* Add Category Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Add a New Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Drug List */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Drug List</h2>
        {drugs.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">
                  Category
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Brand Names
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Patient Advice
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {drugs.map((drug) => (
                <tr key={drug.id}>
                  <td className="border border-gray-300 p-2">{drug.id}</td>
                  <td className="border border-gray-300 p-2">{drug.name}</td>
                  <td className="border border-gray-300 p-2">
                    {categories.find(
                      (category) => category.id === drug.category_id
                    )?.name || "Uncategorized"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {drug.brand_names}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {drug.patient_advice}
                  </td>
                  <td className="border border-gray-300 p-2">{drug.profile}</td>
                  <td className="border border-gray-300 p-2">{drug.status}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(drug)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStatusChange(drug.id!, drug.status)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-blue-600"
                    >
                      Toggle Status
                    </button>
                    <button
                      onClick={() => handleDelete(drug.id!)}
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
            No drugs available. Add a new drug to get started.
          </p>
        )}
      </div>
    </div>
  );
}
