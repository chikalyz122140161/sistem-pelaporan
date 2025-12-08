import { useState } from "react";

const TicketForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Umum",
    priority: "LOW",
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      return;
    }
    onSubmit({ ...form });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Buat Tiket Baru</h3>

      <div style={{ marginBottom: 8 }}>
        <label>
          Judul
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          Deskripsi
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          Kategori
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            <option value="Umum">Umum</option>
            <option value="Layanan">Layanan</option>
            <option value="Teknis">Teknis</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          Prioritas
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Tiket"}
      </button>
    </form>
  );
};

export default TicketForm;
