import "./Navbar.css";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  FaSearch,
  FaBell,
  FaMoon,
  FaBars,
} from "react-icons/fa";


function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  // =========================
  // PAGE TITLES
  // =========================

  const titles = {
    "/dashboard": "Dashboard",
    "/leads": "Leads",
    "/customers": "Customers",
    "/quotations": "Quotations",
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


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  // =========================
  // NAVBAR
  // =========================

  return (

    <header className="crm-navbar">

      {/* =========================
          LEFT
      ========================== */}

      <div className="navbar-left">

        <button
          type="button"
          className="menu-toggle"
          aria-label="Menu"
        >
          <FaBars />
        </button>


        <div className="navbar-title">

          <h2>{pageTitle}</h2>

          <span>
            Welcome back 👋
          </span>

        </div>

      </div>


      {/* =========================
          SEARCH
      ========================== */}

      <div className="navbar-search">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search customers, leads, products..."
        />

      </div>


      {/* =========================
          RIGHT
      ========================== */}

      <div className="navbar-right">


        {/* Dark Mode */}

        <button
          type="button"
          className="icon-box"
          aria-label="Toggle theme"
        >
          <FaMoon />
        </button>


        {/* Notifications */}

        <button
          type="button"
          className="icon-box notification-btn"
          aria-label="Notifications"
        >

          <FaBell />

          <span className="badge">
            3
          </span>

        </button>


        {/* Profile */}

        <div className="profile">

          <div className="avatar">

            {user?.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "A"}

          </div>


          <div className="profile-info">

            <h4>
              {user?.name || "Administrator"}
            </h4>

            <p>
              {user?.role || "Admin"}
            </p>

          </div>

        </div>


        {/* Logout */}

        <button
          type="button"
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