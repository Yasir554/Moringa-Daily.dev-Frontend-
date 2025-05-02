import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserNavbar from "./pages/UserNavbar";
import AdminTechNavbar from "./pages/AdminTechNavbar";
import Notifications from "./components/Notifications";
import DeactivatedPage from "./components/";

// import AllChat from "./components/AllChat";
import Category from "./components/Category";
import CreatePost from "./components/CreatePost";
// import DeactivatedPage from "./components/DeactivatedPage";
// import Footer from "./components/Footer";

import HomeBefore from "./pages/HomeBefore";
import AdminHome from "./pages/AdminHome";
import TechHome from "./pages/TechHome";
import UserHome from "./pages/UserHome";
// import About from './pages/About.jsx';

// import AdminProfile from "./pages/AdminProfile";
// import TechProfile from "./pages/TechProfile";
// import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import SingleChat from "./pages/SingleChat";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Login/>
      <SignUp/>
      <HomeBefore/>
      <CreatePost/>
      <Category/>
      <UserHome/>
      <AdminHome/>
      <TechHome/>
      <Notifications/>


      <Routes>
        {/* <Route path="/" element={<HomeBefore />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminHome />} /> */}
        {/* <Route path="/tech" element={<TechHome />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/tech/profile" element={<TechProfile />} />
        <Route path="/user/profile" element={<UserProfile />} /> */}
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
