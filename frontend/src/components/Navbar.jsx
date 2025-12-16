import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout?.();
    } finally {
      setMenuOpen(false);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll(); // set initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-left">
          <span className="brand">SiLaporCloud</span>
        </div>

        <div className="desktop-menu">
          {user?.role === "USER" && <Link to="/user">Dashboard User</Link>}
          {user?.role === "ADMIN" && <Link to="/admin">Dashboard Admin</Link>}

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {user && (
            <>
              <span className="username">
                {user.name} ({user.role})
              </span>
              <button
                className="logout-btn"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          className={`hamburger-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {user?.role === "USER" && (
          <Link to="/user" onClick={() => setMenuOpen(false)}>
            Dashboard User
          </Link>
        )}
        {user?.role === "ADMIN" && (
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            Dashboard Admin
          </Link>
        )}

        {!user && (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="mobile-username">
              {user.name} ({user.role})
            </span>
            <button
              className="mobile-logout-btn"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </>
        )}
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #2946ff;
          transition: background 0.3s, backdrop-filter 0.3s;
        }
        .navbar.scrolled {
          background: rgba(41,70,255,0.35);
          backdrop-filter: blur(12px) saturate(140%);
          -webkit-backdrop-filter: blur(12px) saturate(140%);
        }
        .nav-left { display: flex; align-items: center; }
        .brand { font-weight: 700; font-size: 25px; color: #fff; margin-right: 24px; }

        .desktop-menu a,
        .desktop-menu .username {
          color: #fff;
          margin-right: 14px;
          text-decoration: none;
          font-weight: 500;
          font-size: 18px;
          opacity: 0.9;
        }

        .desktop-menu .logout-btn {
          padding: 6px 14px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          background: #e12626;
          color: #fff;
          border: none;
          cursor: pointer;
        }
        .desktop-menu .logout-btn:hover { background: #b91c1c; }

        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 25px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .hamburger-btn span {
          display: block;
          height: 3px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger-btn.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
        .hamburger-btn.open span:nth-child(2) { opacity: 0; }
        .hamburger-btn.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }

        .mobile-menu {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: #2946ff;
          z-index: 999;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .mobile-menu.open {
          max-height: 500px;
        }

        .mobile-menu a,
        .mobile-menu .mobile-username {
          color: #fff;
          padding: 12px 24px;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          font-weight: 500;
        }

        .mobile-menu .mobile-logout-btn {
          padding: 10px 24px;
          margin: 10px 24px 16px;
          border-radius: 8px;
          background: #e12626;
          border: none;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
        }
        .mobile-menu .mobile-logout-btn:hover { background: #b91c1c; }

        @media (max-width: 768px) {
          .desktop-menu { display: none; }
          .hamburger-btn { display: flex; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
