import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await findUserByEmail(email);
    if (exist) return res.status(400).json({ message: "Email already used" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await createUser(name, email, hash);

    const token = jwt.sign(user, process.env.JWT_SECRET);

    return res.json({ message: "Register success", user, token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET
    );

    return res.json({ message: "Login success", user, token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
