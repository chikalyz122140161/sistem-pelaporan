import { useEffect, useState } from "react";
import api from "../services/api";
import TicketTable from "../components/TicketTable";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await api.get("/tickets");
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

  const handleChangeStatus = async (ticketId, newStatus) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, { status: newStatus });
      loadTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>Dashboard Admin</h2>
      {loadingTickets ? (
        <div>Memuat tiket...</div>
      ) : (
        <TicketTable
          tickets={tickets}
          showActions={true}
          onChangeStatus={handleChangeStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;