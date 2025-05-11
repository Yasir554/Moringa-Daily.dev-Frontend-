import { useState, useEffect } from "react";
import AdminNavbar from "../pages/AdminNavbar";

export default function AdminCreateContent() {
  const [activeTab, setActiveTab] = useState("text");
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    content_type: "article",
    category_id: ""
  });
  const [categories, setCategories] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const updatedFiles = [...mediaFiles, ...files];
    setMediaFiles(updatedFiles);

    const updatedPreviews = [
      ...previewUrls,
      ...files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      })),
    ];
    setPreviewUrls(updatedPreviews);
  }

  function removeFile(index) {
    const updatedFiles = [...mediaFiles];
    const updatedPreviews = [...previewUrls];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setMediaFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token || token.split(".").length !== 3) {
      setError("Invalid or missing token. Please log in again.");
      return;
    }

    if (formData.title.trim().length < 5) {
      setError("Title must be at least 5 characters long.");
      return;
    }

    if (formData.body.trim().length < 10) {
      setError("Body must be at least 10 characters long.");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("body", formData.body);
    data.append("content_type", formData.content_type);
    data.append("category_id", formData.category_id);
    mediaFiles.forEach((file) => data.append("media", file));

    try {
      const res = await fetch("http://localhost:5000/api/content", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to post content.");
      } else {
        setSuccess("Content posted successfully!");
        setFormData({ title: "", body: "", content_type: "article", category_id: "" });
        setMediaFiles([]);
        setPreviewUrls([]);
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error. Please try again.");
    }
  }

  return (
    <>
      <AdminNavbar user={user} />
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6"
      >
        <h1 className="text-2xl font-bold">Create Post</h1>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        <div className="flex gap-4 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`py-1 px-3 border-b-2 ${
              activeTab === "text" ? "border-blue-600" : "border-transparent"
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`py-1 px-3 border-b-2 ${
              activeTab === "media" ? "border-blue-600" : "border-transparent"
            }`}
          >
            Image & Video
          </button>
        </div>

        {activeTab === "text" && (
          <textarea
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            rows={6}
            placeholder="Body"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        )}

        {activeTab === "media" && (
          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="block"
            />
            <div className="grid grid-cols-2 gap-4">
              {previewUrls.map((file, idx) => (
                <div key={idx} className="relative">
                  {file.type.startsWith("image") ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={file.url}
                      controls
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black text-white text-xs px-2 py-1 rounded">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Dropdown */}
        <div className="space-y-2 mt-4">
          <label htmlFor="category_id" className="text-sm font-semibold text-gray-700">
            Select Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Choose a Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Content Type Dropdown */}
        <div className="space-y-2 mt-4">
          <label htmlFor="content_type" className="text-sm font-semibold text-gray-700">
            Select Content Type
          </label>
          <select
            id="content_type"
            name="content_type"
            value={formData.content_type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="podcast">Podcast</option>
            <option value="document">Document</option>
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => {
              setFormData({ title: "", body: "", content_type: "article", category_id: "" });
              setMediaFiles([]);
              setPreviewUrls([]);
              setError("");
              setSuccess("");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            Discard
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
}
