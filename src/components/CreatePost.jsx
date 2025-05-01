import { useState } from "react";

export default function CreateContent() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category_id: "",
    content_type: "", // Add this
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        return;
      }

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center text-gray-800">Create Content</h1>

      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        name="body"
        placeholder="Content Body"
        onChange={handleChange}
        rows={5}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        name="category_id"
        placeholder="Category ID"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        name="content_type"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select content type</option>
        <option value="article">Article</option>
        <option value="video">Video</option>
        <option value="podcast">Podcast</option>
      </select>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Create Content
      </button>
    </form>
  );

}
