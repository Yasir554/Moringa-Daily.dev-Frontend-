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
import Category from './components/Category';
import AllChat from './pages/AllChat';
import CreatePost from './components/CreatePost';
import Footer from './components/Footer';
import SharedHome from './pages/SharedHome';


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

          {/* User Routes */}
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/home" element={<SharedHome />} />
          <Route path="/user/navbar" element={<UserNavbar />} />
          <Route path="/user/create-post" element={<CreatePost />} />
          <Route path="/user/category" element={<Category />} />
          <Route path="/user/chat" element={<AllChat />} />

          {/* Tech Writer Routes */}
          <Route path="/tech/profile" element={<TechProfile />} />
          <Route path="/tech/home" element={<TechHome />} />
          <Route path="/tech/panel" element={<TechPanel />} />
          <Route path="/tech/chat" element={<AllChat />} />
          <Route path="/tech/navbar" element={<TechNavbar />} />
          <Route path="/tech/category" element={<Category />} />
          <Route path="/tech/create-post" element={<CreatePost />} />

          {/* Admin Routes */}
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/home" element={<SharedHome />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/admin/chat" element={<AllChat />} />
          <Route path="/admin/navbar" element={<AdminNavbar />} />
          <Route path="/admin/category" element={<Category />} />
          <Route path="/admin/create-post" element={<CreatePost />} />

          {/* Shared */}
          <Route path="/chat/:id" element={<SingleChat />} />
          <Route path="/deactivated" element={<DeactivatedPage />} />
          

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Footer only for selected pages */}
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
