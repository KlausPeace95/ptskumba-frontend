import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import LogoutPage from './Logout';
import profile from "../../../assets/images/user.jpg";
import { ThemeContext } from "../../../context/ThemeContext";
import { useAuthStore } from "../../../store/store";

const TeacherHeader = () => {
  const [headerFix, setheaderFix] = useState(false);
  const { background, changeBackground } = useContext(ThemeContext);
  const { user } = useAuthStore();

  const handleThemeMode = () => {
    if (background.value === 'dark') {
      changeBackground({ value: "light", label: "Light" });
    } else {
      changeBackground({ value: "dark", label: "Dark" });
    }
  }

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div className="dashboard_bar">
                Teacher Dashboard
              </div>
            </div>
            <div className="navbar-nav header-right">
              
              {/* Theme Toggle */}
              <div className="nav-item dropdown notification_dropdown">
                <div 
                  className="nav-link bell dz-theme-mode"
                  onClick={handleThemeMode}
                  style={{ cursor: 'pointer' }}
                >
                  <i id="icon-light" className={`fas fa-sun ${background.value === "dark" ? "" : "text-warning"}`}></i>
                  <i id="icon-dark" className={`fas fa-moon ${background.value === "light" ? "" : "text-info"}`}></i>
                </div>
              </div>

              {/* Profile Dropdown */}
              <Dropdown as="li" className="nav-item dropdown header-profile">
                <Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer" role="button" data-toggle="dropdown">
                  <img src={profile} width="20" alt="profile" />
                  <div className="header-info ms-3">
                    <span className="font-w600">
                      {user?.first_name || 'Teacher'} <b>{user?.last_name || 'User'}</b>
                    </span>
                    <small className="text-end font-w400">
                      {user?.role || 'Teacher'}
                    </small>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="mt-3 dropdown-menu dropdown-menu-end">
                  <Link to="/teacher-dashboard/profile" className="dropdown-item ai-icon">
                    <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="ms-2">Profile</span>
                  </Link>
                  <Link to="/teacher-dashboard/settings" className="dropdown-item ai-icon">
                    <svg id="icon-inbox" xmlns="http://www.w3.org/2000/svg" className="text-success" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span className="ms-2">Settings</span>
                  </Link>
                  <LogoutPage />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default TeacherHeader;
