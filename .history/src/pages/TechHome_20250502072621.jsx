import React, { useEffect, useState } from 'react';
import AdminTechNavbar from "./pages/AdminTechNavbar";


const UserHome = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/content')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch content');
        return res.json();
      })
      .then(data => {
        setContents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching content:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading content...</div>;

  return (
    </>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {contents.map(content => (
        <div key={content.id} className="bg-white shadow rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
          <p className="text-sm text-gray-600 mb-2">By: {content.user?.username}</p>
          {content.content_type === 'image' && content.file_url && (
            <img src={content.file_url} alt={content.title} className="w-full rounded mb-2" />
          )}
          {content.content_type === 'video' && content.file_url && (
            <video controls className="w-full rounded mb-2">
              <source src={content.file_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <p className="text-gray-700">{content.body}</p>
        </div>
      ))}
    </div>
  );
};

export default UserHome;
