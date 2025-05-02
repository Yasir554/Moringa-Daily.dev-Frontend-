import { useEffect, useState } from 'react';
import UserNavbar from './UserNavbar';

const UserHomePage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/content', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setContent(data);
        } else {
          setError("Unexpected data format received from server.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching content:", err);
        setError("Failed to load content.");
        setLoading(false);
      });
  }, []);

  const handleLike = (id) => {
    // TODO: Call your backend to like/unlike
    console.log("Liked content:", id);
  };

  const handleComment = (id) => {
    // TODO: Open comment modal or redirect
    console.log("Comment on content:", id);
  };

  const handleShare = (id) => {
    // TODO: Trigger share functionality
    console.log("Shared content:", id);
  };

  return (
    <>
      <UserNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Latest Content</h1>

        {loading && <p>Loading...</p>}
        {error && <div className="text-red-600 font-medium">{error}</div>}
        {!loading && !error && content.length === 0 && <p>No content available.</p>}

        {!loading && !error && Array.isArray(content) && (
          <div className="grid gap-4">
            {content.map(item => (
              <div key={item.id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="text-gray-700 mb-2">
                  {item.body?.substring(0, 150)}...
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Posted on: {new Date(item.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLike(item.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Like
                  </button>
                  <button
                    onClick={() => handleComment(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Comment
                  </button>
                  <button
                    onClick={() => handleShare(item.id)}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserHomePage;

