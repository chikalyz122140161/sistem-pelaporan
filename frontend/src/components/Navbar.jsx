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
    <nav style={{ padding: "10px 20px", borderBottom: "1px solid #ddd" }}>
      <span style={{ fontWeight: "bold", marginRight: 20 }}>SiLaporCloud</span>

      {user && user.role === "USER" && (
        <Link to="/user/dashboard" style={{ marginRight: 10 }}>
          Dashboard User
        </Link>
      )}
      {user && user.role === "ADMIN" && (
        <Link to="/admin/dashboard" style={{ marginRight: 10 }}>
          Dashboard Admin
        </Link>
      )}

      {!user && (
        <>
          <Link to="/login" style={{ marginRight: 10 }}>
            Login
          </Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {user && (
        <span style={{ float: "right" }}>
          <span style={{ marginRight: 10 }}>
            {user.name} ({user.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </span>
      )}
    </nav>
  );
};

export default Navbar;