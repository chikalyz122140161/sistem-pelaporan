import pool from "../config/db.js";

export const createTicket = async (
  user_id,
  title,
  description,
  category,
  priority
) => {
  const query = `
    INSERT INTO tickets (user_id, title, description, category, priority, status)
    VALUES ($1, $2, $3, $4, $5, 'OPEN')
    RETURNING *
  `;
  const result = await pool.query(query, [
    user_id,
    title,
    description,
    category,
    priority,
  ]);
  return result.rows[0];
};

export const getTicketsByUser = async (user_id) => {
  const query = `
    SELECT *
    FROM tickets
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

export const getAllTickets = async () => {
  const query = `
    SELECT *
    FROM tickets
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const updateTicketStatus = async (ticket_id, status) => {
  const query = `
    UPDATE tickets
    SET status = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [status, ticket_id]);
  return result.rows[0];
};

export const deleteTicketById = async (id) => {
  const result = await pool.query(
    "DELETE FROM tickets WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0] || null; 
};
