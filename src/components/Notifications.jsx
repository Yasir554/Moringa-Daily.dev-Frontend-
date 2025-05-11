import React, { useEffect, useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('https://moringa-daily-dev-nr3m.onrender.com/api/notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
      })
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching notifications:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading notifications...</div>;

  if (notifications.length === 0) {
    return <div className="text-center mt-10 text-gray-600">No notifications yet.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map(notification => (
          <li
            key={notification.id}
            className={`p-4 rounded-lg shadow ${
              notification.is_read ? 'bg-gray-100' : 'bg-blue-50'
            }`}
          >
            <p className="text-gray-800">{notification.message}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
