# 🌐 Moringa School Daily.dev – Frontend

### 🔗 Live Site: [https://moringa-daily-dev.vercel.app](https://moringa-daily-dev.vercel.app)  
### 🖥️ Frontend Repo: [GitHub - Moringa-Daily.dev-Frontend](https://github.com/Yasir554/Moringa-Daily.dev-Frontend-.git)  
### 🛠 Backend Repo: [GitHub - The-Moringa-daily](https://github.com/Yasir554/The-Moringa-daily.git)  
### ⚙️ Backend API: [https://moringa-daily-dev-nr3m.onrender.com](https://moringa-daily-dev-nr3m.onrender.com)

---

## 📖 Project Overview

**Moringa School Daily.dev** is a full-stack platform where students can access **authentic, community-verified tech content** in the form of articles, videos, and audio.  
Built with the goal of **empowering learners**, this application encourages content sharing, learning, and collaboration among peers, alumni, and staff.

---

## 💡 Problem Statement

Students need a reliable space to consume tech-related content created by their peers, alumni, and professionals. This platform ensures content is verified, relevant, and organized into categories like Fullstack, DevOps, and Frontend.

---

## 🚀 Tech Stack (Frontend)

- ⚛️ React + Vite
- 🎨 Tailwind CSS for styling
- 🔄 React Router DOM for routing
- 💬 Socket.IO Client for real-time messaging
- 🔐 JWT Decode for user authentication
- 📅 Date-fns for readable timestamps
- 🧠 Lucide Icons, React Icons

---

## 🔐 User Roles & Features (MVP)

### 👑 Admin
- Add, deactivate users
- Create content categories
- Approve/flag content
- Moderate platform usage

### ✍️ Tech Writer
- Create/update profile
- Submit and edit content (blogs, audio, video)
- Categorize submissions (Fullstack, Frontend, DevOps)
- Like/dislike, comment, share content
- Flag inappropriate posts

### 🙋‍♂️ User
- Create profile and customize interests
- Subscribe to preferred content categories
- Read/listen/view and interact with content
- Add to wishlist
- Comment & start threaded conversations (Reddit-style)
- Share content
- Receive personalized recommendations and notifications

---

## 🗂 Folder Structure (Frontend)

Moringa-daily.dev/
├── dist/ # Production build assets
├── node_modules/ # Dependencies
├── public/ # Static assets (logos, images)
├── src/
│ ├── test/ # Test files (if any)
│ ├── components/ # Reusable UI components
│ ├── context/ # Global state/context
│ ├── pages/ # Main page views
│ ├── App.jsx # Route and layout wrapper
│ ├── main.jsx # Vite entry point
│ └── index.css # Tailwind and global styles
├── index.html # Main HTML file
├── package.json # Project metadata and dependencies
├── tailwind.config.js # Tailwind setup
├── vite.config.js # Vite config
└── postcss.config.js # PostCSS config
---

## 🛠️ Getting Started (Frontend)

### 1. Clone the repository

```bash
git clone https://github.com/Yasir554/Moringa-Daily.dev-Frontend-.git
cd Moringa-Daily.dev-Frontend-
```

### 2. Install dependencies
```bash
Copy
Edit
npm install
```

### 3. Run locally
```bash
Copy
Edit
npm run dev
```

#### Make sure your backend is running on http://localhost:5000 or update the proxy settings accordingly.

## 🔗 Backend API

### All data interactions (login, registration, content CRUD, comments, notifications, etc.) are handled by the Flask API.
📍 View backend repo: https://github.com/Yasir554/The-Moringa-daily.git
📍 Backend deployment: https://moringa-daily-dev-nr3m.onrender.com
---

## 👥 Contributors

### Special thanks to the team behind this project:

#### 1. Collins Likhomba []
#### 2. Kenneth Thuo []
#### 3. Joan Wambui []
#### 4. Diana Nzile []
#### 5. muraya Ngume []
#### 6. yasir Abass []

##### Want to contribute? Feel free to fork this project and submit a pull request!

---

## ✨ Final Note
### Built ❤️ by Moringa students to empower fellow developers through community-driven tech content.