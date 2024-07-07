import React from "react";
import "./assets/CSS/navBar.css";

const NavBar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <a>Home</a>
        </li>
        <li>
          <a>Shop *COMING SOON*</a>
        </li>
        <li>
          <a>Gallary *COMING SOON*</a>
        </li>
        <li>
          <a>How to use</a>
        </li>
        <li>
          <a href="https://www.w3schools.com/html/default.asp">
            Development Blog
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
