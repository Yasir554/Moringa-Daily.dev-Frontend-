import React, { useState } from 'react';

const ContentForm = () => {
  const [contentTitle, setContentTitle] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [contentType, setContentType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [url, setUrl] = useState(''); // New state for URL
  const [token, setToken] = useState(''); // Placeholder for JWT token

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure required fields are not empty
    if (!contentTitle || !contentBody || !categoryId) {
      alert('Title, Body, and Category are required');
      return;
    }

    const data = {
      title: contentTitle,
      body: contentBody,
      content_type: contentType,
      category_id: categoryId,
      url: url, // Include URL field
    };

    try {
      const response = await fetch('http://localhost:5000/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure JWT token is sent
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Something went wrong'}`);
        return;
      }

      const result = await response.json();
      console.log(result);
      alert('Content added successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the content');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={contentTitle}
          onChange={(e) => setContentTitle(e.target.value)}
        />
      </label>
      <label>
        Body:
        <textarea
          value={contentBody}
          onChange={(e) => setContentBody(e.target.value)}
        />
      </label>
      <label>
        Content Type:
        <input
          type="text"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />
      </label>
      <label>
        URL:
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)} // Handling URL input
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ContentForm;