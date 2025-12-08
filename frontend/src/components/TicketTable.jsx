const TicketTable = ({ tickets = [], onChangeStatus, showActions }) => {
  const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

  return (
    <table border="1" cellPadding="6" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Judul</th>
          <th>Kategori</th>
          <th>Prioritas</th>
          <th>Status</th>
          <th>Dibuat</th>
          {showActions && <th>Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {tickets.length === 0 ? (
          <tr>
            <td colSpan={showActions ? 7 : 6} style={{ textAlign: "center" }}>
              Belum ada tiket.
            </td>
          </tr>
        ) : (
          tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.category || "-"}</td>
              <td>{t.priority || "-"}</td>
              <td>{t.status}</td>
              <td>
                {t.created_at
                  ? new Date(t.created_at).toLocaleString("id-ID")
                  : "-"}
              </td>
              {showActions && (
                <td>
                  <select
                    value={t.status}
                    onChange={(e) =>
                      onChangeStatus && onChangeStatus(t.id, e.target.value)
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TicketTable;
