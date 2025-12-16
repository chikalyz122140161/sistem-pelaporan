import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar"

const normalizeStatusClass = (status) =>
  (status || "").toString().trim().toLowerCase(); // "IN_PROGRESS" -> "in_progress"

const normalizePriorityClass = (priority) =>
  (priority || "").toString().trim().toLowerCase(); // "HIGH" -> "high"

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tickets");
      const data = Array.isArray(res.data) ? res.data : [];
      setTickets(data);
    } catch (err) {
      console.error(err);
      const code = err?.response?.status;
      if (code === 401 || code === 403) {
        alert("Akses ditolak. Pastikan Anda login sebagai ADMIN.");
      } else {
        alert("Gagal memuat tiket. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTickets = useMemo(() => {
    let data = [...tickets];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter((t) => (t.title || "").toLowerCase().includes(q));
    }

    if (status) {
      data = data.filter((t) => t.status === status);
    }

    if (priority) {
      const p = priority.trim().toUpperCase();
      data = data.filter(
        (t) => (t.priority || "").toString().trim().toUpperCase() === p
      );
    }

    return data;
  }, [search, status, priority, tickets]);

  const handleChangeStatus = async (id, nextStatus) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status: nextStatus });
      // refresh supaya konsisten dengan backend
      await loadTickets();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status tiket.");
    }
  };

  const handleDeleteTicket = async (id) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus tiket ini? Tindakan ini tidak dapat dibatalkan."
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/tickets/${id}`);
      // hapus dari state tanpa reload
      setTickets((prev) => prev.filter((t) => (t.id ?? t.ticket_id) !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus tiket.");
    }
  };

  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const progress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <>
    <Navbar/>
    <div className="admin-page">
      <style>{`
.admin-page {
  padding: 60px;
  background: #e0f2fe;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
}

h1 { font-size: 28px; font-weight: 700; }
.subtitle { color: #6b7280; margin-bottom: 24px; }

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  position: relative;
  background: #ffffff;
  border-radius: 14px;
  padding: 22px 20px 22px 26px;
  overflow: hidden;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.06),
    0 10px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.08),
    0 16px 30px rgba(0, 0, 0, 0.12);
}

.stat-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
  border-radius: 12px 0 0 12px;
}

.stats .stat-card:nth-child(1)::before { background: #3b82f6; }
.stats .stat-card:nth-child(2)::before { background: #f59e0b; }
.stats .stat-card:nth-child(3)::before { background: #8b5cf6; }
.stats .stat-card:nth-child(4)::before { background: #10b981; }

.stat-card span { color: #6b7280; font-size: 14px; }
.stat-card strong { display:block; font-size: 26px; font-weight: 700; margin-top: 4px; color: #111827; }

.filter-bar {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 14px rgba(0,0,0,.1);
}

.filter-bar input, .filter-bar select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.table-wrapper {
  background: #fff;
  border-radius: 14px;
  overflow-x: auto;
  box-shadow: 0 4px 14px rgba(0,0,0,.1);
}

.ticket-table { width: 100%; border-collapse: collapse; }
.ticket-table th { padding: 12px; background: #f9fafb; color: #6b7280; }
.ticket-table td { padding: 12px; border-top: 1px solid #e5e7eb; }
.ticket-table tr:hover { background: #f3f4f6; }

.badge {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.badge.high { background: #ffedd5; color: #c2410c; }
.badge.medium { background: #dbeafe; color: #1d4ed8; }
.badge.low { background: #f3f4f6; }

.badge.open { background: #dbeafe; }
.badge.in_progress { background: #fef3c7; }
.badge.resolved { background: #dcfce7; }

.action-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-select {
  padding: 6px 10px;
  border-radius: 8px;
}

.btn-delete {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  background: #fff;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover { background: #fee2e2; border-color: #fca5a5; }
.btn-delete:active { transform: scale(0.96); }
.btn-delete:focus { outline: none; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2); }
      `}</style>

      <h1>Dashboard Admin</h1>
      <p className="subtitle">Kelola dan monitor semua tiket support</p>

      <div className="stats">
        <div className="stat-card">
          <span>Total</span>
          <strong>{total}</strong>
        </div>
        <div className="stat-card">
          <span>Open</span>
          <strong>{open}</strong>
        </div>
        <div className="stat-card">
          <span>Progress</span>
          <strong>{progress}</strong>
        </div>
        <div className="stat-card">
          <span>Resolved</span>
          <strong>{resolved}</strong>
        </div>
      </div>

      <div className="filter-bar">
        <input
          placeholder="Cari judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">Semua Prioritas</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                  Memuat...
                </td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                  Tidak ada tiket.
                </td>
              </tr>
            ) : (
              filteredTickets.map((t) => {
                const rowId = t.id ?? t.ticket_id;
                return (
                  <tr key={rowId}>
                    <td>{rowId}</td>
                    <td>{t.title || "-"}</td>
                    <td>{t.category || "-"}</td>
                    <td>{t.description || "-"}</td>

                    <td>
                      <span
                        className={`badge ${normalizePriorityClass(
                          t.priority
                        )}`}
                      >
                        {t.priority || "-"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${normalizeStatusClass(t.status)}`}
                      >
                        {t.status || "-"}
                      </span>
                    </td>

                    <td className="action-cell">
                      <select
                        className="action-select"
                        value={t.status || "OPEN"}
                        onChange={(e) =>
                          handleChangeStatus(rowId, e.target.value)
                        }
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>

                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteTicket(rowId)}
                        title="Hapus tiket"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
