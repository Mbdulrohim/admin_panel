"use client";

import { useState } from "react";

type Notification = {
  title: string;
  message: string;
  type: "announcement" | "banner" | "promotion" | "alert" | "reminder" | "";
  target: "iphone" | "android" | "both" | "";
  image: File | null;
  link: string;
};

export default function NotificationPage() {
  const [notification, setNotification] = useState<Notification>({
    title: "",
    message: "",
    type: "",
    target: "",
    image: null,
    link: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof Notification, value: string) => {
    setNotification((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file: File | null) => {
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG and PNG images are allowed.");
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width === 1080 && img.height === 1920) {
          setNotification((prev) => ({ ...prev, image: file }));
          setImagePreview(URL.createObjectURL(file));
        } else {
          alert("Image dimensions must be 1080x1920 pixels.");
          setImagePreview(null); // Clear image preview if invalid
          setNotification((prev) => ({ ...prev, image: null }));
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const sendNotification = () => {
    if (
      notification.title.trim() &&
      notification.message.trim() &&
      notification.type
    ) {
      console.log("Sending Notification:", notification);
      alert("Notification Sent!");
      setNotification({
        title: "",
        message: "",
        type: "",
        target: "",
        image: null,
        link: "",
      });
      setImagePreview(null);
    } else {
      alert("Please fill out all required fields.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 h-screen flex flex-col items-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Send Notification</h1>
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            value={notification.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Notification Title"
            className="w-full p-2 border border-gray-300 rounded-sm"
          />
        </div>

        {/* Message Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            value={notification.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Notification Message"
            className="w-full p-2 border border-gray-300 rounded-sm"
          />
        </div>

        {/* Notification Type */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Notification Type</label>
          <select
            value={notification.type}
            onChange={(e) => handleInputChange("type", e.target.value as Notification["type"])}
            className="w-full p-2 border border-gray-300 rounded-sm"
          >
            <option value="">Select Type</option>
            <option value="announcement">Announcement</option>
            <option value="banner">Banner</option>
            <option value="promotion">Promotion</option>
            <option value="alert">Alert</option>
            <option value="reminder">Reminder</option>
          </select>
        </div>

        {/* Target Device */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Target Device</label>
          <select
            value={notification.target}
            onChange={(e) => handleInputChange("target", e.target.value as Notification["target"])}
            className="w-full p-2 border border-gray-300 rounded-sm"
          >
            <option value="">Select Target</option>
            <option value="iphone">iPhone</option>
            <option value="android">Android</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Upload Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Image (1080x1920)
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
            className="p-2 border border-gray-300 rounded-sm"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-32 h-64 object-cover rounded-sm border border-gray-300"
            />
          )}
        </div>

        {/* Link App Page */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Link to App Page</label>
          <input
            type="text"
            value={notification.link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            placeholder="Enter link to page in app (optional)"
            className="w-full p-2 border border-gray-300 rounded-sm"
          />
        </div>

        {/* Send Notification Button */}
        <button
          onClick={sendNotification}
          className="bg-green-600 text-white px-6 py-2 rounded-sm w-full hover:bg-green-700 transition"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
}
