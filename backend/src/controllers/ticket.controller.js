import {
  createTicket,
  getTicketsByUser,
  getAllTickets,
  updateTicketStatus,
} from "../models/ticket.model.js";

export const create = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { title, description, category, priority } = req.body;

    const ticket = await createTicket(user_id, title, description, category, priority);
    res.json(ticket);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await getTicketsByUser(req.user.id);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const ticket_id = req.params.id;
    const { status } = req.body;

    const updated = await updateTicketStatus(ticket_id, status);
    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
