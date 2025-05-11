import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SingleChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [receiverName, setReceiverName] = useState('User');
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/chats/${id}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages || []);
        setReceiverName(data.receiver_name || 'User');
      })
      .catch(err => console.error('Error loading chat:', err));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    fetch(`http://localhost:5000/api/chats/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input }),
    })
      .then(res => res.json())
      .then(msg => {
        setMessages(prev => [...prev, msg]);
        setInput('');
      })
      .catch(err => console.error('Error sending message:', err));
  };

  return (
    <div className="h-screen bg-[#F7F8FA] flex flex-col max-w-xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-3 bg-white shadow px-4 py-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#F46422] text-2xl font-bold">
          ←
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <h2 className="font-semibold text-[#0B1C39]">{receiverName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-xs ${
                msg.isSender
                  ? 'bg-white text-black rounded-br-none shadow'
                  : 'bg-[#0B1C39] text-white rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.content || msg.body}</p>

              {/* Shared Post Handling */}
              {msg.sharedPost && (
                <div className="mt-3 border-t pt-2">
                  <p className="text-xs font-bold mb-1">{msg.sharedPost.title}</p>
                  {msg.sharedPost.type === 'video' ? (
                    <video controls className="w-full rounded">
                      <source src={msg.sharedPost.url} type="video/mp4" />
                    </video>
                  ) : (
                    <div>
                      <img
                        src={msg.sharedPost.image}
                        alt="Shared Content"
                        className="rounded mb-1"
                      />
                      <p className="text-xs text-gray-300">{msg.sharedPost.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 sticky bottom-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 text-sm"
        />
        <button
          onClick={handleSend}
          className="bg-[#F46422] hover:bg-orange-600 text-white text-sm px-4 py-1.5 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SingleChat;
