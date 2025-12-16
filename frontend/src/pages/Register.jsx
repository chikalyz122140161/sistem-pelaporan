import React, { useState } from "react";
import toa from "../assets/toa.png";
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
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Daftar SiLaporCloud</h2>
          <p style={styles.subtitle}>
            Buat akun baru untuk mengelola tiket pelaporan
          </p>

          {errorMsg && <div style={styles.error}>{errorMsg}</div>}
          {successMsg && <div style={styles.success}>{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>

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
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p style={styles.footerText}>
            Sudah punya akun?{" "}
            <Link to="/login" style={styles.link}>
              Masuk disini
            </Link>
          </p>
        </div>

        {/* RIGHT - IMAGE */}
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
    backgroundColor: "#1976d2",
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

  success: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#e6f4ea",
    color: "#1b5e20",
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

  link: {
    color: "#1976d2",
    fontWeight: 500,
    textDecoration: "none",
  },
};

export default Register;
