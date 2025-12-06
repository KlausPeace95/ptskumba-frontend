import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FinanceMenuList } from './FinanceMenu';
import { ThemeContext } from "../../../context/ThemeContext";

const FinanceSideBar = () => {
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);



  return (
    <>
      <div className={`deznav ${iconHover} ${sidebarposition} ${headerposition} ${sidebarLayout}`}>
        <div className="deznav-scroll">
          <div className="main-profile">
            <div className="image-bx">
              <img src="/src/assets/images/avatar/avatar-1.jpg" alt="" />
              <Link to="/profile" className="edit-btn">
                <i className="fas fa-camera"></i>
              </Link>
            </div>
            <h5 className="name">
              <span className="font-w400">Finance</span> Accountant
            </h5>
            <p className="email">finance@school.com</p>
          </div>
          <ul className="metismenu" id="menu">
            {FinanceMenuList.map((item, index) => (
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

export default FinanceSideBar;
