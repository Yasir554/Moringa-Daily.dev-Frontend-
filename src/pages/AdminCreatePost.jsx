import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../pages/AdminNavbar';

const AdminCreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setErrorMsg("No token found. Please login again.");
      setLoading(false);
      return;
    }

    const payload = {
      title,
      body,
      category_id: categoryId,
      content_type: contentType
    };

    console.log("Token:", token);
    console.log("Payload:", payload);

    try {
      const res = await fetch("http://localhost:5000/api/content", {
        method: "POST",
        headers: {
          "Accept": "application/json",               // ✅ Recommended
          "Content-Type": "application/json",         // ✅ Must be this for Flask to parse
          "Authorization": `Bearer ${token}`          // ✅ Required for @jwt_required
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error("Failed to parse JSON response: " + text);
      }

      if (res.ok) {
        setSuccessMsg("Post created successfully!");
        setTitle('');
        setBody('');
        setCategoryId('');
        setContentType('blog');
      } else {
        setErrorMsg(data.error || "Failed to create content.");
      }

    } catch (error) {
      console.error("Submit error:", error);
      setErrorMsg(error.message || "An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-2xl mx-auto mt-10 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Content</h2>

        {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="5"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Category ID</label>
            <input
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="blog">Blog</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminCreatePost;
