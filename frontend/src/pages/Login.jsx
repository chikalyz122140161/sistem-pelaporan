import React, { useState } from "react";
import toa from "../assets/toa.png";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || "/user";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const result = await login(email, password);
    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    if (result.user.role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/user", { replace: true });
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>SiLaporCloud</h2>
          <p style={styles.subtitle}>Masuk untuk mengelola tiket pelaporan</p>

          {errorMsg && <div style={styles.error}>{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                backgroundColor: loading ? "#0f4c81" : "#0f4c81",
              }}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p style={styles.footerText}>
            Belum punya akun?{" "}
            <Link to="/register" style={styles.link}>
              Daftar disini
            </Link>
          </p>
        </div>

        <div style={styles.imageWrapper}>
          <img src={toa} alt="Ilustrasi Pengumuman" style={styles.image} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0f2fe, #e0f2fe)",
    padding: 16,
  },

  container: {
    display: "flex",
    width: "100%",
    maxWidth: 900,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
  },

  card: {
    flex: 1,
    padding: 40,
  },

  imageWrapper: {
    flex: 1,
    background: "linear-gradient(135deg, #1976d2, #1976d2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "70%",
    maxWidth: 280,
  },

  title: {
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },

  error: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fdecea",
    color: "#b71c1c",
    fontSize: 14,
  },

  formGroup: {
    marginBottom: 16,
  },

  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 500,
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },

  button: {
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },

  footerText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
  },
};

export default Login;
