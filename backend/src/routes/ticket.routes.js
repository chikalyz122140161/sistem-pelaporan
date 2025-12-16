import express from "express";
import {
  create,
  getMyTickets,
  getAll,
  changeStatus,
  deleteTicket,
} from "../controllers/ticket.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.get("/my", verifyToken, getMyTickets);

// Admin only
router.get("/", verifyToken, isAdmin, getAll);
router.patch("/:id/status", verifyToken, isAdmin, changeStatus);
router.delete("/:id", verifyToken, isAdmin, deleteTicket);

export default router;
