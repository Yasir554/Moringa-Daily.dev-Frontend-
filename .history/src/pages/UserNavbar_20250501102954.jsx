import { Link } from "react-router-dom";


const UserNavbar = () => {
    return (<>
    <Link to="/login" className="navbar-brand"> Login </Link>
    <Link to="/category" className="navbar-brand"> Category </Link>
    <Link to="/chat" className="navbar-brand"> Chat </Link>
    <Link to="/p" className="navbar-brand"> Login </Link>

    </>)
    }

export default UserNavbar;