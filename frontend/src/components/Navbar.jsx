import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        backgroundColor: scrolled ? "rgba(41,70,255,0.35)" : "#2946ff",

        backdropFilter: scrolled ? "blur(12px) saturate(140%)" : "none",

        WebkitBackdropFilter: scrolled ? "blur(12px) saturate(140%)" : "none",

        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: 25,
            marginRight: 24,
            color: "#fff",
          }}
        >
          SiLaporCloud
        </span>

        {user?.role === "USER" && (
          <Link to="/user" style={linkStyle}>
            Dashboard User
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link to="/admin" style={linkStyle}>
            Dashboard Admin
          </Link>
        )}

        {!user && (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        )}
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              color: "#fff",
              marginRight: 14,
              fontSize: 16,
              opacity: 0.9,
            }}
          >
            {user.name} ({user.role})
          </span>

          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px",
              fontSize: 16,
              fontWeight: 500,
              borderRadius: 8,
              background: "#e12626ff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#b91c1c")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#dc2626")}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const linkStyle = {
  marginRight: 14,
  fontSize: 18,
  fontWeight: 500,
  color: "#fff",
  textDecoration: "none",
  opacity: 0.9,
};

export default Navbar;
