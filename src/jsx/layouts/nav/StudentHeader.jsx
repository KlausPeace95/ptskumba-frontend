import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import LogoutPage from './Logout';
import profile from "../../../assets/images/user.jpg";
import { ThemeContext } from "../../../context/ThemeContext";
import { useAuthStore } from "../../../store/store";

const StudentHeader = () => {
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
                Student Dashboard
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
                      {user?.first_name || 'Student'} <b>{user?.last_name || 'User'}</b>
                    </span>
                    <small className="text-end font-w400">
                      {user?.role || 'Student'}
                    </small>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="mt-3 dropdown-menu dropdown-menu-end">
                  <Link to="/student/profile" className="dropdown-item ai-icon">
                    <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="ms-2">My Profile</span>
                  </Link>
                  <Link to="/student/applications" className="dropdown-item ai-icon">
                    <svg id="icon-inbox" xmlns="http://www.w3.org/2000/svg" className="text-success" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="ms-2">My Applications</span>
                  </Link>
                  <Link to="/student/grades" className="dropdown-item ai-icon">
                    <svg id="icon-grades" xmlns="http://www.w3.org/2000/svg" className="text-info" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    <span className="ms-2">Grades & Transcripts</span>
                  </Link>
                  <Link to="/student/settings" className="dropdown-item ai-icon">
                    <svg id="icon-settings" xmlns="http://www.w3.org/2000/svg" className="text-warning" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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

export default StudentHeader;
