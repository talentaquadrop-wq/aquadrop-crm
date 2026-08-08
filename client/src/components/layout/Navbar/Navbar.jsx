import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaMoon,
  FaBars,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const titles = {
    "/dashboard": "Dashboard",
    "/leads": "Leads",
    "/customers": "Customers",
    "/installations": "Installations",
    "/services": "Services",
    "/inventory": "Inventory",
    "/dispatch": "Dispatch",
    "/employees": "Employees",
    "/reports": "Reports",
    "/settings": "Settings",
  };

  const pageTitle =
    titles[location.pathname] || "Aqua Drop CRM";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="navbar-left">
        <FaBars className="menu-toggle" />

        <div>
          <h2>{pageTitle}</h2>
          <span>Welcome back 👋</span>
        </div>
      </div>

      <div className="navbar-search">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search customers, leads, products..."
        />
      </div>

      <div className="navbar-right">

        <button className="icon-box">
          <FaMoon />
        </button>

        <button className="icon-box">
          <FaBell />
          <span className="badge">3</span>
        </button>

        <div className="profile">

          <div className="avatar">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "A"}
          </div>

          <div className="profile-info">
            <h4>{user?.name || "Guest"}</h4>
            <p>{user?.role || "User"}</p>
          </div>

        </div>

        <button
          className="logout-btn-nav"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;