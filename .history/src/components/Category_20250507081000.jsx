
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TechNavbar from ''

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('JWT Token:', token);

        if (!token) {
          throw new Error('No JWT token found');
        }

        const response = await fetch('http://localhost:5000/api/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',

            'Authorization': `Bearer ${token}`,

          },
        });

        console.log('Response Status:', response.status);

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Something went wrong while fetching categories.');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleSubscribe = (categoryId) => {
    // Add subscription logic here, for example, making an API call to subscribe to the category

    console.log(`Subscribed to category with ID: ${categoryId}`);

  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Categories</h2>
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-orange-100 rounded-lg p-4 shadow-md text-center hover:bg-orange-200 transition"
            >
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <button 
                onClick={() => handleSubscribe(category.id)} 
                className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No categories found.</p>
      )}
    </div>
  );
};


export default CategoryList;
