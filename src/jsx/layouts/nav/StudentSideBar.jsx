import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StudentMenuList } from './StudentMenu';
import { ThemeContext } from "../../../context/ThemeContext";
import { useAuthStore } from "../../../store/store";

const StudentSideBar = () => {
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);

  const { user } = useAuthStore();

  return (
    <>
      <div className={`deznav ${iconHover} ${sidebarposition} ${headerposition} ${sidebarLayout}`}>
        <div className="deznav-scroll">
          <div className="main-profile">
            <div className="image-bx">
              <img src="/src/assets/images/avatar/avatar-1.jpg" alt="" />
              <Link to="/student/profile" className="edit-btn">
                <i className="fas fa-camera"></i>
              </Link>
            </div>
            <h5 className="name">
              <span className="font-w400">{user?.first_name || 'Student'}</span> {user?.last_name || 'User'}
            </h5>
            <p className="email">{user?.email || 'student@school.com'}</p>
          </div>
          <ul className="metismenu" id="menu">
            {StudentMenuList.map((item, index) => (
              <li key={index} className={item.classsChange}>
                {item.to ? (
                  <Link to={item.to} className="ai-icon">
                    {item.iconStyle}
                    <span className="nav-text">{item.title}</span>
                  </Link>
                ) : (
                  <a href="#" className="ai-icon">
                    {item.iconStyle}
                    <span className="nav-text">{item.title}</span>
                    {item.content && (
                      <i className="fas fa-chevron-down"></i>
                    )}
                  </a>
                )}
                {item.content && (
                  <ul>
                    {item.content.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link to={subItem.to}>{subItem.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default StudentSideBar;
