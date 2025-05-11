import React, { useState, useEffect } from 'react';
import AdminNavbar from '../pages/AdminNavbar';

const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
        <p className="mb-5 text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3 text-sm">
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

const AdminCategory = ({ userRole }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [subscriptions, setSubscriptions] = useState({});
  const [subsLoading, setSubsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [unsubscribeModal, setUnsubscribeModal] = useState({ isOpen: false, categoryId: null });

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    const fetchSubscriptions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/subscriptions/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const subMap = {};
        data.forEach((cat) => {
          subMap[cat.id] = true;
        });
        setSubscriptions(subMap);
      } catch (err) {
        console.error("Failed to fetch subscriptions:", err);
      } finally {
        setSubsLoading(false);
      }
    };

    fetchCategories();
    fetchSubscriptions();
  }, [token]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setNewCategoryName('');
      }
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  const handleSubscribe = async (categoryId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/subscribe/category/${categoryId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setSubscriptions(prev => ({
          ...prev,
          [categoryId]: true,
        }));
      }
    } catch (err) {
      console.error("Subscription error:", err);
    }
  };

  const handleUnsubscribe = async (categoryId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/unsubscribe/category/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSubscriptions(prev => ({
          ...prev,
          [categoryId]: false,
        }));
      }
    } catch (err) {
      console.error("Unsubscribe error:", err);
    }
  };

  const confirmUnsubscribe = (categoryId) => {
    setUnsubscribeModal({ isOpen: true, categoryId });
  };

  const handleConfirmUnsubscribe = async () => {
    await handleUnsubscribe(unsubscribeModal.categoryId);
    setUnsubscribeModal({ isOpen: false, categoryId: null });
  };

  const handleCancelUnsubscribe = () => {
    setUnsubscribeModal({ isOpen: false, categoryId: null });
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(note => note.id !== id));
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminNavbar />
      <Modal
        isOpen={unsubscribeModal.isOpen}
        title="Confirm Unsubscribe"
        message="Are you sure you want to unsubscribe from this category?"
        onConfirm={handleConfirmUnsubscribe}
        onCancel={handleCancelUnsubscribe}
      />

      <section className="w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg mx-auto bg-gray-100 rounded-lg shadow-md px-4 sm:px-8 py-8 mt-10 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 border-b pb-2">
          Categories
        </h2>

        {userRole === 'admin' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-gray-300 p-2 sm:p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              className={`w-full sm:w-auto px-4 py-2 rounded font-semibold text-white transition ${
                newCategoryName.trim()
                  ? 'bg-gray-700 hover:bg-gray-800'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
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
          className="w-full border border-gray-300 p-2 rounded-md text-sm"
        />

        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {filteredCategories.length === 0 ? (
            <li className="text-gray-500 text-sm">No categories found.</li>
          ) : (
            filteredCategories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between p-3 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                <span className="font-medium text-gray-800">{cat.name}</span>
                {!subsLoading && subscriptions[cat.id] === true ? (
                  <button
                    onClick={() => confirmUnsubscribe(cat.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(cat.id)}
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    disabled={subsLoading}
                  >
                    Subscribe
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg mx-auto bg-gray-100 rounded-lg shadow-md px-4 sm:px-8 py-8 mt-8 space-y-6 max-h-72 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 border-b pb-2">
            Notifications
          </h2>
          {notifications.length > 0 && (
            <button
              onClick={() => setNotifications([])}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((note) => (
              <li
                key={note.id}
                className="flex justify-between items-start border-b pb-2"
              >
                <div>
                  <p className="text-gray-800 font-medium text-sm">{note.message}</p>
                  <small className="text-gray-600">{note.date.toLocaleString()}</small>
                </div>
                <button
                  onClick={() => dismissNotification(note.id)}
                  className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default AdminCategory;
