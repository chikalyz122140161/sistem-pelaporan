import { useEffect, useState } from "react";
import api from "../services/api";
import TicketForm from "../components/TicketForm";
import TicketTable from "../components/TicketTable";

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await api.get("/tickets/my");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreate = async (data) => {
    setCreating(true);
    try {
      await api.post("/tickets", data);
      await loadTickets();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>Dashboard Pengguna</h2>

      <TicketForm onSubmit={handleCreate} loading={creating} />

      <h3>Daftar Tiket Anda</h3>
      {loadingTickets ? (
        <div>Memuat tiket...</div>
      ) : (
        <TicketTable tickets={tickets} showActions={false} />
      )}
    </div>
  );
};

export default UserDashboard;
