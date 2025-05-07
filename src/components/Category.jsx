import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TechNavbar from '../pages/TechNavbar'


// Simple Modal component for confirmation
const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Category = ({ userRole }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [subscriptions, setSubscriptions] = useState({});
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [unsubscribeModal, setUnsubscribeModal] = useState({ isOpen: false, categoryId: null });

  useEffect(() => {
    const initialCategories = [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Health' },
      { id: 3, name: 'Finance' },
    ];
    setCategories(initialCategories);
    setSubscriptions({
      1: true,
      2: false,
      3: true,
    });
  }, []);

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = {
      id: categories.length + 1,
      name: newCategoryName.trim(),
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const toggleSubscription = (categoryId) => {
    const newSubs = { ...subscriptions, [categoryId]: !subscriptions[categoryId] };
    setSubscriptions(newSubs);
  };

  const confirmUnsubscribe = (categoryId) => {
    setUnsubscribeModal({ isOpen: true, categoryId });
  };

  const handleConfirmUnsubscribe = () => {
    toggleSubscription(unsubscribeModal.categoryId);
    setUnsubscribeModal({ isOpen: false, categoryId: null });
  };

  const handleCancelUnsubscribe = () => {
    setUnsubscribeModal({ isOpen: false, categoryId: null });
  };

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  const handleCreatePost = () => {
    if (!postTitle.trim() || !postContent.trim() || !selectedCategoryId) return;

    const newPost = {
      id: Date.now(),
      title: postTitle.trim(),
      content: postContent.trim(),
      categoryId: selectedCategoryId,
      authorRole: userRole,
      createdAt: new Date(),
    };

    setPosts([newPost, ...posts]);

    const subscribedRoles = ['admin', 'techwriter'];
    if (subscriptions[selectedCategoryId] && subscribedRoles.includes(userRole)) {
      const categoryName = categories.find(c => c.id === selectedCategoryId)?.name || '';
      const newNotification = {
        id: Date.now(),
        message: 'New post titled "' + newPost.title + '" assigned to category "' + categoryName + '"',
        date: new Date(),
      };
      setNotifications([newNotification, ...notifications]);
    }

    setPostTitle('');
    setPostContent('');
    setShowPreview(false);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6 max-w-5xl mx-auto rounded-lg shadow-lg text-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">Category & Post Management</h1>

      <Modal
        isOpen={unsubscribeModal.isOpen}
        title="Confirm Unsubscribe"
        message="Are you sure you want to unsubscribe from this category?"
        onConfirm={handleConfirmUnsubscribe}
        onCancel={handleCancelUnsubscribe}
      />

      {/* Category Section */}
      <section className="p-6 bg-white bg-opacity-20 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-semibold mb-6 border-b border-pink-400 pb-2">Categories</h2>
        {userRole === 'admin' && (
          <div className="mb-6 flex">
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-pink-300 p-3 rounded-l-lg flex-grow focus:outline-none focus:ring-4 focus:ring-pink-400"
            />
            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              className={`px-6 py-3 rounded-r-lg font-semibold text-white transition-colors duration-300 ${
                newCategoryName.trim()
                  ? 'bg-pink-500 hover:bg-pink-600'
                  : 'bg-pink-300 cursor-not-allowed'
              }`}
              title="Create new category"
            >
              Create
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full p-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-400"
          aria-label="Search categories"
        />
        <ul className="max-h-64 overflow-y-auto">
          {filteredCategories.length === 0 && <li className="text-pink-200">No categories found.</li>}
          {filteredCategories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between mb-3 p-3 rounded-lg bg-pink-700 bg-opacity-40 hover:bg-pink-600 transition-colors cursor-pointer"
            >
              <span className="font-medium">{cat.name}</span>
              {subscriptions[cat.id] ? (
                <button
                  onClick={() => confirmUnsubscribe(cat.id)}
                  className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                  title="Unsubscribe from category"
                >
                  Unsubscribe
                </button>
              ) : (
                <button
                  onClick={() => toggleSubscription(cat.id)}
                  className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                  title="Subscribe to category"
                >
                  Subscribe
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Post Section */}
      <section className="p-6 bg-white bg-opacity-20 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-semibold mb-6 border-b border-pink-400 pb-2">Create Post</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Post Title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="border border-pink-300 p-3 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-pink-400"
            aria-label="Post Title"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Post Content"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="border border-pink-300 p-3 rounded-lg w-full h-32 resize-none focus:outline-none focus:ring-4 focus:ring-pink-400"
            aria-label="Post Content"
          />
        </div>
        {(userRole === 'admin' || userRole === 'techwriter') && (
          <div className="mb-4">
            <label className="block mb-2 font-medium text-pink-200">Assign Category:</label>
            <select
              value={selectedCategoryId || ''}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              className="border border-pink-300 p-3 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-pink-400"
              aria-label="Select Category"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex space-x-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            disabled={!postTitle.trim() || !postContent.trim()}
            className={`flex-1 py-3 rounded-lg font-semibold text-white transition-colors duration-300 ${
              postTitle.trim() && postContent.trim()
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-purple-300 cursor-not-allowed'
            }`}
            aria-pressed={showPreview}
            aria-label="Toggle post preview"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handleCreatePost}
            disabled={!postTitle.trim() || !postContent.trim() || !selectedCategoryId}
            className={`flex-1 py-3 rounded-lg font-semibold text-white transition-colors duration-300 ${
              postTitle.trim() && postContent.trim() && selectedCategoryId
                ? 'bg-pink-600 hover:bg-pink-700'
                : 'bg-pink-300 cursor-not-allowed'
            }`}
            aria-label="Create post"
          >
            Post
          </button>
        </div>
        {showPreview && (
          <div className="mt-6 p-4 bg-pink-700 bg-opacity-50 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-2">{postTitle}</h3>
            <p className="whitespace-pre-wrap">{postContent}</p>
          </div>
        )}
      </section>

      {/* Notifications Section */}
      <section className="p-6 bg-white bg-opacity-20 rounded-lg shadow-md max-h-72 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold border-b border-pink-400 pb-2">Notifications</h2>
          {notifications.length > 0 && (
            <button
              onClick={() => setNotifications([])}
              className="text-pink-300 hover:text-pink-100 font-semibold"
              aria-label="Clear all notifications"
            >
              Clear All
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="text-pink-200">No notifications</p>
        ) : (
          <ul>
            {notifications.map((note) => (
              <li
                key={note.id}
                className="mb-3 border-b border-pink-400 pb-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{note.message}</p>
                  <small className="text-pink-300">{note.date.toLocaleString()}</small>
                </div>
                <button
                  onClick={() => dismissNotification(note.id)}
                  className="ml-4 text-pink-300 hover:text-pink-100"
                  aria-label="Dismiss notification"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    </>
  );
};

export default Category;