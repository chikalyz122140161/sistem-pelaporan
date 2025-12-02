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
    onSubmit(form, () => {
      // reset setelah sukses
      setForm({ title: "", description: "", category: "Umum", priority: "LOW" });
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Buat Tiket Baru</h3>

      <div>
        <label>Judul</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
      </div>

      <div>
        <label>Kategori</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8 }}
        >
          <option value="Umum">Umum</option>
          <option value="Fasilitas">Fasilitas</option>
          <option value="IT">IT</option>
          <option value="Administrasi">Administrasi</option>
        </select>
      </div>

      <div>
        <label>Prioritas</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8 }}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>

      <div>
        <label>Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Tiket"}
      </button>
    </form>
  );
};

export default TicketForm;