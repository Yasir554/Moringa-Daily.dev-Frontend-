import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TechNavbar from '../pages/TechNavbar';

const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <p className="mb-6 text-gray-600">{message}</p>
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

const TechCategory = ({ userRole }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [subscriptions, setSubscriptions] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [unsubscribeModal, setUnsubscribeModal] = useState({ isOpen: false, categoryId: null });

  useEffect(() => {
    const initialCategories = [
      { id: 1, name: 'Cybersecurity' },
      { id: 2, name: 'Software Engineering' },
      { id: 3, name: 'Data Science' },
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

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(note => note.id !== id));
  };

  return (
    <>
        <TechNavbar />
        <Modal
          isOpen={unsubscribeModal.isOpen}
          title="Confirm Unsubscribe"
          message="Are you sure you want to unsubscribe from this category?"
          onConfirm={handleConfirmUnsubscribe}
          onCancel={handleCancelUnsubscribe}
        />

        {/* Category Section */}
        <section className="w-full max-w-md mx-auto bg-gray-100 rounded-lg shadow-md px-8 py-12 space-y-6 mb-8 mt-12">
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-400 pb-2 text-gray-800">
            Categories
          </h2>
          {userRole === 'admin' && (
            <div className="mb-6 flex">
              <input
                type="text"
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="border border-gray-300 p-3 rounded-l-lg flex-grow focus:outline-none focus:ring-4 focus:ring-gray-400 text-gray-800"
              />
              <button
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim()}
                className={`px-6 py-3 rounded-r-lg font-semibold text-white transition-colors duration-300 ${
                  newCategoryName.trim()
                    ? 'bg-gray-700 hover:bg-gray-800'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                title="Create new category"
              >
                Create
              </button>
            </div>
          )}

          <ul className="max-h-64 overflow-y-auto">
            {filteredCategories.length === 0 && (
              <li className="text-gray-500">No categories found.</li>
            )}
            {filteredCategories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between mb-3 p-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <span className="font-medium text-gray-800">{cat.name}</span>
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

        {/* Notifications Section */}
        <section className="w-full max-w-md mx-auto bg-gray-100 rounded-lg shadow-md px-8 py-12 space-y-6 max-h-72 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold border-b border-gray-400 pb-2 text-gray-800">
              Notifications
            </h2>
            {notifications.length > 0 && (
              <button
                onClick={() => setNotifications([])}
                className="text-gray-600 hover:text-gray-800 font-semibold"
                aria-label="Clear all notifications"
              >
                Clear All
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications</p>
          ) : (
            <ul>
              {notifications.map((note) => (
                <li
                  key={note.id}
                  className="mb-3 border-b border-gray-400 pb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{note.message}</p>
                    <small className="text-gray-600">{note.date.toLocaleString()}</small>
                  </div>
                  <button
                    onClick={() => dismissNotification(note.id)}
                    className="ml-4 text-gray-600 hover:text-gray-800"
                    aria-label="Dismiss notification"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      
    </>
  );
};

export default TechCategory;