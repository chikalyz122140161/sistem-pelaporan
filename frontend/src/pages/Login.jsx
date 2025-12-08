import React, { useState } from "react";
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

    navigate(from, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#ffffff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Masuk ke SiLaporCloud
        </h2>
        <p
          style={{
            marginBottom: 24,
            textAlign: "center",
            fontSize: 14,
            color: "#666",
          }}
        >
          Gunakan akun yang sudah terdaftar untuk mengelola tiket pelaporan.
        </p>

        {errorMsg && (
          <div
            style={{
              marginBottom: 16,
              padding: 10,
              borderRadius: 6,
              backgroundColor: "#ffe5e5",
              color: "#b00020",
              fontSize: 14,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: 4, fontSize: 14 }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: 4, fontSize: 14 }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "none",
              borderRadius: 6,
              backgroundColor: loading ? "#999" : "#1976d2",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              marginBottom: 12,
            }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p
          style={{
            fontSize: 14,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Belum punya akun?{" "}
          <Link to="/register" style={{ color: "#1976d2" }}>
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
