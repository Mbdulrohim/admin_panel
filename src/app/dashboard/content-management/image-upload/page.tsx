"use client";

import { useState } from 'react';

export default function ImageUploadPage() {
  const [images, setImages] = useState([
    {
      id: 1,
      imageId: 'IMG001',
      title: 'Sunset',
      description: 'A beautiful sunset over the mountains.',
      url: 'https://via.placeholder.com/400',
      status: 'Published',
    },
  ]);

  const [newImage, setNewImage] = useState<{
    id?: number; // Optional since it's not present for new images
    imageId: string;
    title: string;
    description: string;
    url: string;
    status: string;
  }>({
    id: undefined,
    imageId: '',
    title: '',
    description: '',
    url: '',
    status: 'Draft',
  });

  const [editingImage, setEditingImage] = useState<{
    id: number;
    imageId: string;
    title: string;
    description: string;
    url: string;
    status: string;
  } | null>(null);
  
  const handleInputChange = (field: keyof typeof newImage, value: string) => {
    setNewImage((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {


  const handleAddImage = () => {
    if (newImage.title.trim() !== '') {
      const newId = `IMG${(images.length + 1).toString().padStart(3, '0')}`;
      setImages((prev) => [
        ...prev,
        { ...newImage, id: prev.length + 1, imageId: newId },
      ]);
      setNewImage({
        imageId: '',
        title: '',
        description: '',
        url: '',
        status: 'Draft',
      });
    }
  };

  const handleEdit = (image: {
    id: number; // Add the id property
    imageId: string;
    title: string;
    description: string;
    url: string;
    status: string;
  }) => {
    setEditingImage(image);
    setNewImage(image);
  };
  

  const handleSaveEdit = () => {
    if (!editingImage) return; // Exit if editingImage is null
  
    setImages((prev) =>
      prev.map((image) =>
        image.id === editingImage.id ? { ...newImage, id: editingImage.id } : image
      )
    );
    setEditingImage(null);
    setNewImage({
      id: undefined,
      imageId: '',
      title: '',
      description: '',
      url: '',
      status: 'Draft',
    });
  };
  

  const handleStatusChange = (id: number) => {
    setImages((prev) =>
      prev.map((image) =>
        image.id === id
          ? { ...image, status: image.status === 'Published' ? 'Draft' : 'Published' }
          : image
      )
    );
  };

  const handleDelete = (id: number) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
  };

  const analytics = {
    totalImages: images.length,
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Total Images</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{analytics.totalImages}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingImage ? 'Edit Image' : 'Upload a New Image'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newImage.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Image Title"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <textarea
            value={newImage.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter description"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
          {newImage.url && (
            <img
              src={newImage.url}
              alt="Preview"
              className="w-full h-auto object-cover rounded-sm col-span-2"
            />
          )}
        </div>
        <button
          onClick={editingImage ? handleSaveEdit : handleAddImage}
          className="bg-green-600 text-white px-4 py-2 rounded-sm mt-4 hover:bg-green-700"
        >
          {editingImage ? 'Save Changes' : 'Upload Image'}
        </button>
        {editingImage && (
          <button
            onClick={() => setEditingImage(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-sm mt-4 ml-2 hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Image List</h2>
        {images.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Image ID</th>
                <th className="border border-gray-300 p-2 text-left">Title</th>
                <th className="border border-gray-300 p-2 text-left">Description</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Image</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image.id}>
                  <td className="border border-gray-300 p-2">{image.id}</td>
                  <td className="border border-gray-300 p-2">{image.imageId}</td>
                  <td className="border border-gray-300 p-2">{image.title}</td>
                  <td className="border border-gray-300 p-2">{image.description}</td>
                  <td className="border border-gray-300 p-2">{image.status}</td>
                  <td className="border border-gray-300 p-2">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-16 h-16 object-cover inline-block mr-2 rounded-sm"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStatusChange(image.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-blue-600"
                    >
                      Toggle Status
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
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
          <p className="text-gray-600">No images available. Upload a new image to get started.</p>
        )}
      </div>
    </div>
  );
}
}