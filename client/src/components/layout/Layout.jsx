import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";

import "./Layout.css";

const Layout = () => {
  return (
    <div className="crm-layout">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="crm-sidebar">
        <Sidebar />
      </aside>


      {/* =========================
          MAIN AREA
      ========================== */}

      <main className="crm-main">

        {/* Navbar ONLY ONCE */}
        <Navbar />

        {/* Page Content */}
        <div className="crm-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default Layout;