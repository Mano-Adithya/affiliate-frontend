import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Profile from "./profile/Profile";
import Users from "./users/Users";
import Wallet from "./wallet/Wallet";

const AffliatesMain = () => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <section className="affliate-user-persona">
      <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <section className="affliate-user-persona-route-area">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<Users />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
      </section>
    </section>
  );
};

export default AffliatesMain;
