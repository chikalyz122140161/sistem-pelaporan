import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import TicketForm from "../components/TicketForm";
import TicketTable from "../components/TicketTable";

const UserDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const totalReports = useMemo(() => reports.length, [reports]);

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tickets/my");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Gagal memuat data laporan. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleCreate = async (data) => {
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      await api.post("/tickets", data);
      setNotice("Laporan berhasil dikirim dan akan segera diproses.");
      await loadReports();
    } catch {
      setError("Pengiriman laporan gagal. Periksa data lalu coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <header className="header">
            <div>
              <h1>Pelayanan Pelaporan Masyarakat</h1>
              <p>
                Sampaikan laporan atau pengaduan Anda secara resmi dan pantau
                proses penanganannya secara transparan.
              </p>
            </div>

            <div className="header-info">
              <div className="stat-box">
                <span>Total Laporan</span>
                <strong>{totalReports}</strong>
              </div>
              <button onClick={loadReports} disabled={loading}>
                {loading ? "Memuat..." : "Perbarui Data"}
              </button>
            </div>
          </header>

          {(error || notice) && (
            <div className="alerts">
              {error && <div className="alert error">{error}</div>}
              {notice && <div className="alert success">{notice}</div>}
            </div>
          )}

          <main className="grid">
            <section className="card">
              <h2>Formulir Pelaporan</h2>
              <p className="desc">
                Isi data laporan dengan lengkap dan benar agar dapat
                ditindaklanjuti.
              </p>

              <div className={submitting ? "disabled" : ""}>
                <TicketForm onSubmit={handleCreate} loading={submitting} />
              </div>

              {submitting && (
                <div className="hint">Mengirim laporan ke sistem...</div>
              )}
            </section>

            <section className="card">
              <h2>Riwayat Laporan</h2>
              <p className="desc">
                Daftar laporan yang telah Anda kirim beserta status
                penanganannya.
              </p>

              {loading ? (
                <div className="skeleton">
                  <div />
                  <div />
                  <div />
                </div>
              ) : (
                <TicketTable tickets={reports} showActions={false} />
              )}
            </section>
          </main>
        </div>
      </div>

      <style>{`
        :root {
          --blue-main: #0f4c81;
          --blue-dark: #0b3a63;
          --blue-soft: #e6f0fa;
          --border: #d6e4f0;
          --text-main: #0f172a;
          --text-muted: #475569;
          --success: #0ea5e9;
          --error: #dc2626;
        }

        * { box-sizing: border-box; }
        body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; background: var(--blue-soft); color: var(--text-main); }

        .page { min-height: 100vh; padding: 80px; }
        @media (max-width: 768px) { .page { padding: 70px 16px 20px; } }

        .container { max-width: 1100px; margin: auto; }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          background: white;
          padding: 20px 22px;
          border-radius: 14px;
          border-left: 6px solid var(--blue-main);
          margin-bottom: 20px;
        }

        .header h1 { margin: 0; font-size: 24px; color: var(--blue-main); }
        .header p { margin-top: 6px; font-size: 14px; color: var(--text-muted); max-width: 60ch; line-height: 1.6; }

        .header-info { display: flex; align-items: center; gap: 12px; }
        @media (max-width: 900px) { .header { flex-direction: column; align-items: flex-start; } .header-info { flex-wrap: wrap; } }

        .stat-box { background: var(--blue-soft); border: 1px solid var(--border); padding: 10px 14px; border-radius: 10px; text-align: center; }
        .stat-box span { display: block; font-size: 12px; color: var(--text-muted); }
        .stat-box strong { font-size: 18px; color: var(--blue-main); }

        button { background: var(--blue-main); color: white; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; font-weight: 600; }
        button:hover { background: var(--blue-dark); }
        button:disabled { opacity: 0.6; cursor: not-allowed; }

        .alerts { margin-bottom: 18px; }
        .alert { padding: 12px 14px; border-radius: 10px; margin-bottom: 8px; font-size: 14px; }
        .alert.error { background: #fee2e2; color: var(--error); }
        .alert.success { background: #e0f2fe; color: var(--blue-main); }

        .grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 18px; }
        @media (max-width: 900px) { .grid { grid-template-columns: 1fr; gap: 14px; } }

        .card { background: white; border-radius: 14px; padding: 18px; border: 1px solid var(--border); }
        .card h2 { margin-top: 0; font-size: 18px; color: var(--blue-main); }
        .desc { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; }

        .disabled { opacity: 0.7; pointer-events: none; }
        .hint { margin-top: 10px; font-size: 12px; color: var(--text-muted); }

        .skeleton div {
          height: 38px;
          background: #e5eef7;
          border-radius: 8px;
          margin-bottom: 10px;
          animation: pulse 1.2s infinite;
        }
        @keyframes pulse { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
      `}</style>
    </>
  );
};

export default UserDashboard;
