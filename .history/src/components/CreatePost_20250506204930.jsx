
// CreatePost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Post = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Retrieve the user id from session storage
  const storedUserId = sessionStorage.getItem("userId");
  const currentUserId = storedUserId ? parseInt(storedUserId, 10) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !body || !currentUserId) {
      setError("Title, body, and a logged-in user are required.");
      return;
    }

    const payload = {
      title,
      body,
      author_id: currentUserId,
      image_url: imageUrl || null, // Optional field
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || errorData.validation_error || "Error creating post.");
      } else {
        // On success, navigate back to the home page
        const newPost = await response.json();
        navigate("/");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      setError("Error submitting post");
    }
  };

  return (
    <>
      
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
              <label 
                htmlFor="title" 
                className="block text-gray-700 font-medium mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label 
                htmlFor="body" 
                className="block text-gray-700 font-medium mb-2"
              >
                Body
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter post content"
                rows="5"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label 
                htmlFor="imageUrl" 
                className="block text-gray-700 font-medium mb-2"
              >
                Image URL (optional)
              </label>
              <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
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
    </>
  );
};

export default Post;
