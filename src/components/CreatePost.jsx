import { useState } from "react";
import AdminNavbar from "../pages/AdminNavbar";
import TechNavbar from "../pages/TechNavbar";
import UserNavbar from "../pages/UserNavbar";

export default function CreateContent() {
  const [activeTab, setActiveTab] = useState("text");
  const [formData, setFormData] = useState({ title: "", body: "" });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  function renderNavbar() {
    const role = user?.role?.toLowerCase().trim();
    console.log("Detected role:", role); // Debugging
  
    if (role === "admin") return <AdminNavbar />;
    if (role === "tech_writer") return <TechNavbar />;
    if (role === "user") return <UserNavbar />;
  
    return <UserNavbar />; // Fallback
  }
  

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
    const data = new FormData();
    data.append("title", formData.title);
    data.append("body", formData.body);
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
        console.error("Error:", result);
      } else {
        console.log("Success:", result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <>
      {renderNavbar()}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6"
      >
        <h1 className="text-2xl font-bold">Create Post</h1>

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

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              setFormData({ title: "", body: "" });
              setMediaFiles([]);
              setPreviewUrls([]);
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