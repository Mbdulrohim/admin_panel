"use client";

import { useState } from 'react';

// Define the video type
type Video = {
  id: number;
  videoId: string;
  title: string;
  description: string;
  url: string;
  status: 'Draft' | 'Published';
};

export default function VideoUploadPage() {
  // Define state for videos
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 1,
      videoId: 'VID001',
      title: 'Nature Walk',
      description: 'A calming video of a walk through the forest.',
      url: 'https://via.placeholder.com/400',
      status: 'Published',
    },
  ]);

  // Define state for new video input
  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    videoId: '',
    title: '',
    description: '',
    url: '',
    status: 'Draft',
  });

  // Define state for editing a video
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Handle input changes
  const handleInputChange = (field: keyof Video, value: string) => {
    setNewVideo((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewVideo((prev) => ({ ...prev, url }));
    }
  };

  // Add a new video
  const handleAddVideo = () => {
    if (newVideo.title?.trim() !== '') {
      const newId = `VID${(videos.length + 1).toString().padStart(3, '0')}`;
      setVideos((prev) => [
        ...prev,
        {
          ...newVideo,
          id: prev.length + 1,
          videoId: newId,
        } as Video,
      ]);
      setNewVideo({
        videoId: '',
        title: '',
        description: '',
        url: '',
        status: 'Draft',
      });
    }
  };

  // Edit a video
  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setNewVideo(video);
  };

  // Save edited video
  const handleSaveEdit = () => {
    if (editingVideo) {
      setVideos((prev) =>
        prev.map((video) =>
          video.id === editingVideo.id ? { ...newVideo, id: editingVideo.id } as Video : video
        )
      );
      setEditingVideo(null);
      setNewVideo({
        videoId: '',
        title: '',
        description: '',
        url: '',
        status: 'Draft',
      });
    }
  };

  // Toggle video status
  const handleStatusChange = (id: number) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id
          ? { ...video, status: video.status === 'Published' ? 'Draft' : 'Published' }
          : video
      )
    );
  };

  // Delete a video
  const handleDelete = (id: number) => {
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  // Analytics
  const analytics = {
    totalVideos: videos.length,
  };

  return (
    <div className="p-8 bg-gray-100 h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Total Videos</h2>
          <p className="text-4xl font-bold text-green-800 mt-2">{analytics.totalVideos}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingVideo ? 'Edit Video' : 'Upload a New Video'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newVideo.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Video Title"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <textarea
            value={newVideo.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter description"
            className="p-2 border border-gray-300 rounded-sm"
          />
          <input
            type="file"
            accept="video/mp4, video/avi, video/mkv"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="p-2 border border-gray-300 rounded-sm col-span-2"
          />
          {newVideo.url && (
            <video
              controls
              src={newVideo.url}
              className="w-full h-auto object-cover rounded-sm col-span-2"
            />
          )}
        </div>
        <button
          onClick={editingVideo ? handleSaveEdit : handleAddVideo}
          className="bg-green-600 text-white px-4 py-2 rounded-sm mt-4 hover:bg-green-700"
        >
          {editingVideo ? 'Save Changes' : 'Upload Video'}
        </button>
        {editingVideo && (
          <button
            onClick={() => setEditingVideo(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-sm mt-4 ml-2 hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Video List</h2>
        {videos.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Video ID</th>
                <th className="border border-gray-300 p-2 text-left">Title</th>
                <th className="border border-gray-300 p-2 text-left">Description</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Video</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id}>
                  <td className="border border-gray-300 p-2">{video.id}</td>
                  <td className="border border-gray-300 p-2">{video.videoId}</td>
                  <td className="border border-gray-300 p-2">{video.title}</td>
                  <td className="border border-gray-300 p-2">{video.description}</td>
                  <td className="border border-gray-300 p-2">{video.status}</td>
                  <td className="border border-gray-300 p-2">
                    <video
                      controls
                      src={video.url}
                      className="w-16 h-16 object-cover inline-block mr-2 rounded-sm"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStatusChange(video.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-sm mr-2 hover:bg-blue-600"
                    >
                      Toggle Status
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
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
          <p className="text-gray-600">No videos available. Upload a new video to get started.</p>
        )}
      </div>
    </div>
  );
}
