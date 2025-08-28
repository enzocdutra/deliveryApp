import { createUser, getUserByUsername } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Pegamos a variável do .env
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Registrar usuário
export const registerUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Campos obrigatórios: username, password" });
  }

  getUserByUsername(username, async (err, user) => {
    if (err) return res.status(500).json({ error: "Erro ao verificar usuário" });
    if (user) return res.status(400).json({ error: "Usuário já existe" });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      createUser({ username, password: hashedPassword }, (err, novo) => {
        if (err) return res.status(500).json({ error: "Erro ao registrar usuário" });
        res.status(201).json({ id: novo.id, username: novo.username });
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criptografar senha" });
    }
  });
};

// Login
export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Campos obrigatórios: username, password" });
  }

  getUserByUsername(username, async (err, user) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar usuário" });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Senha inválida" });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Erro ao validar senha" });
    }
  });
};
