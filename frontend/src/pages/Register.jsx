import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const result = await register(name, email, password);

    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    setSuccessMsg("Registrasi berhasil. Silakan login.");
    // Sedikit jeda sebelum pindah ke halaman login, kalau mau
    setTimeout(() => {
      navigate("/login");
    }, 1000);
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
          maxWidth: 460,
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
          Daftar Akun SiLaporCloud
        </h2>
        <p
          style={{
            marginBottom: 24,
            textAlign: "center",
            fontSize: 14,
            color: "#666",
          }}
        >
          Buat akun baru untuk mengirim dan memantau tiket pelaporan Anda.
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

        {successMsg && (
          <div
            style={{
              marginBottom: 16,
              padding: 10,
              borderRadius: 6,
              backgroundColor: "#e6f4ea",
              color: "#1b5e20",
              fontSize: 14,
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: 4, fontSize: 14 }}
            >
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
              backgroundColor: loading ? "#999" : "#388e3c",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              marginBottom: 12,
            }}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p
          style={{
            fontSize: 14,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Sudah punya akun?{" "}
          <Link to="/login" style={{ color: "#1976d2" }}>
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
