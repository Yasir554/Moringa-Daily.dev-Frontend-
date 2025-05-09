// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import HomeBefore from './pages/HomeBefore';
import About from './pages/About';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import TechProfile from './pages/TechProfile';
import AdminPanel from './pages/AdminPanel';
import TechPanel from './pages/TechPanel';
import AdminNavbar from './pages/AdminNavbar';
import AdminHome from './pages/AdminHome';
import TechHome from './pages/TechHome';
import TechNavbar from './pages/TechNavbar';
import UserHome from './pages/UserHome';
import UserNavbar from './pages/UserNavbar';
import SingleChat from './pages/SingleChat';
import DeactivatedPage from './components/DeactivatedPage';
import AdminCategory from './pages/AdminCategory';
import TechCategory from './pages/TechCategory';
import UserCategory from './pages/UserCategory';
import AdminAllChat from './pages/AdminAllChat';
import TechAllChat from './pages/TechAllChat';
import UserAllChat from './pages/UserAllChat';
import AdminCreatePost from './pages/AdminCreatePost';
import TechCreatePost from './pages/TechCreatePost';
import UserCreatePost from './pages/UserCreatePost';
import Footer from './components/Footer';


// New additions
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const AppLayout = () => {
  const location = useLocation();
  const showFooterRoutes = ['/', '/about', '/login', '/signup'];
  const shouldShowFooter = showFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomeBefore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />

          {/* ✅ User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/home" element={<UserHome />} />
            <Route path="/user/navbar" element={<UserNavbar />} />
            <Route path="/user/create-post" element={<UserCreatePost />} />
            <Route path="/user/category" element={<UserCategory />} />
            <Route path="/user/chat" element={<UserAllChat />} />
          </Route>

          {/* ✅ Tech Writer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['tech']} />}>
            <Route path="/tech/profile" element={<TechProfile />} />
            <Route path="/tech/home" element={<TechHome />} />
            <Route path="/tech/panel" element={<TechPanel />} />
            <Route path="/tech/chat" element={<TechAllChat />} />
            <Route path="/tech/navbar" element={<TechNavbar />} />
            <Route path="/tech/category" element={<TechCategory />} />
            <Route path="/tech/create-post" element={<TechCreatePost />} />
          </Route>

          {/* ✅ Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/panel" element={<AdminPanel />} />
            <Route path="/admin/chat" element={<AdminAllChat />} />
            <Route path="/admin/navbar" element={<AdminNavbar />} />
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route path="/admin/create-post" element={<AdminCreatePost />} />
          </Route>

          {/* ✅ Shared Authenticated Route */}
          <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'tech']} />}>
            <Route path="/chat/:id" element={<SingleChat />} />
          </Route>

          <Route path="/deactivated" element={<DeactivatedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Footer only on public pages */}
      {shouldShowFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
