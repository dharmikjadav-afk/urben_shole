import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiTruck,
  FiLogOut,
  FiHelpCircle,
} from "react-icons/fi";

import "./Navbar.css";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext"; 

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext); 

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          UrbanSole
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/men">Men</NavLink>
          <NavLink to="/women">Women</NavLink>
          <NavLink to="/kids">Kids</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>


        <div className="nav-actions">
 
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          {/* Help Center */}
          <Link to="/help" className="icon-btn" aria-label="Help Center">
            <FiHelpCircle />
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="icon-btn wishlist-icon">
            <FiHeart />
            {user && wishlist.length > 0 && (
              <span className="nav-badge">{wishlist.length}</span>
            )}
          </Link>

  
          <Link to="/cart" className="icon-btn">
            <FiShoppingCart />
            {user && cartCount > 0 && (
              <span className="nav-badge">{cartCount}</span>
            )}
          </Link>


          <Link to="/track-order" className="icon-btn">
            <FiTruck />
          </Link>

 
          {!user ? (
            <Link to="/login" className="login-btn">
              <FiUser />
              <span>Login</span>
            </Link>
          ) : (
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FiUser />
                <span>{user.name.split(" ")[0]}</span>
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <button onClick={handleLogout}>
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                  <button onClick={() => navigate("/orders")}>My Orders</button>
                </div>
              )}
            </div>
          )}


          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/men" onClick={closeMenu}>
          Men
        </NavLink>
        <NavLink to="/women" onClick={closeMenu}>
          Women
        </NavLink>
        <NavLink to="/kids" onClick={closeMenu}>
          Kids
        </NavLink>
        <NavLink to="/about" onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>
        <NavLink to="/help" onClick={closeMenu}>
          Help Center
        </NavLink>

        {!user ? (
          <NavLink to="/login" onClick={closeMenu}>
            Login
          </NavLink>
        ) : (
          <button className="mobile-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
