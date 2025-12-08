import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f8f8f8",
      }}
    >
      <div>
        <span style={{ fontWeight: "bold", marginRight: 20 }}>
          SiLaporCloud
        </span>
        {user ? (
          <>
            {user.role === "USER" && (
              <Link to="/user" style={{ marginRight: 12 }}>
                Dashboard User
              </Link>
            )}
            {user.role === "ADMIN" && (
              <Link to="/admin" style={{ marginRight: 12 }}>
                Dashboard Admin
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 12 }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

      {user && (
        <div>
          <span style={{ marginRight: 10 }}>
            {user.name} ({user.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
