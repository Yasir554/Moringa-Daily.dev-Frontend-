import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SingleChat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/chats/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setMessages(data.messages))
      .catch(err => console.error('Error loading chat:', err));
  }, [id]);

  const handleSend = () => {
    if (!input.trim()) return;
    fetch(`http://localhost:5000/api/chats/${id}/message`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: input })
    })
      .then(res => res.json())
      .then(msg => {
        setMessages(prev => [...prev, msg]);
        setInput('');
      })
      .catch(err => console.error('Error sending message:', err));
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-100 h-[90vh] flex flex-col">
      <div className="bg-white p-4 shadow flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <h2 className="text-lg font-bold">Joan</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg max-w-xs ${msg.isSender ? 'bg-blue-900 text-white' : 'bg-white text-black'}`}>
              <p>{msg.body}</p>
              {msg.sharedPost && (
                <div className="mt-2 border-t pt-2">
                  <p className="text-sm font-semibold">{msg.sharedPost.title}</p>
                  {msg.sharedPost.type === 'video' ? (
                    <video controls className="w-full mt-1">
                      <source src={msg.sharedPost.url} type="video/mp4" />
                    </video>
                  ) : (
                    <div>
                      <img src={msg.sharedPost.image} alt="Shared Post" className="w-full rounded mt-1" />
                      <p className="text-sm mt-1">{msg.sharedPost.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-1"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-orange-500 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SingleChat;
