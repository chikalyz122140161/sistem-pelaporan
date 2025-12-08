import {
  createTicket,
  getTicketsByUser,
  getAllTickets,
  updateTicketStatus,
} from "../models/ticket.model.js";

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export const create = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const ticket = await createTicket(
      user_id,
      title,
      description,
      category || null,
      priority || "LOW"
    );

    return res.status(201).json(ticket);
  } catch (err) {
    console.error("Create ticket error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const user_id = req.user.id;
    const tickets = await getTicketsByUser(user_id);
    return res.json(tickets);
  } catch (err) {
    console.error("Get my tickets error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAll = async (req, res) => {
  try {
    const tickets = await getAllTickets();
    return res.json(tickets);
  } catch (err) {
    console.error("Get all tickets error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const ticket_id = req.params.id;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await updateTicketStatus(ticket_id, status);
    if (!updated) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Change status error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
