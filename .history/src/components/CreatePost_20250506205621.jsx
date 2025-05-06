// CreatePost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contentType, setContentType] = useState("article"); // e.g., "article", "video", etc.
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const storedUserId = sessionStorage.getItem("userId");
  const currentUserId = storedUserId ? parseInt(storedUserId, 10) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body || !contentType || !categoryId || !currentUserId) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      title,
      body,
      content_type: contentType,
      category_id: parseInt(categoryId, 10),
      author_id: currentUserId
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.validation_error || "Error creating post.");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      setError("Error submitting post.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Create a New Post</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-gray-700 font-medium mb-2">
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows="5"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contentType" className="block text-gray-700 font-medium mb-2">
              Content Type
            </label>
            <select
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select type</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="categoryId" className="block text-gray-700 font-medium mb-2">
              Category ID
            </label>
            <input
              id="categoryId"
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white font-bold py-2 px-4 rounded hover:bg-purple-800 transition duration-200"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
