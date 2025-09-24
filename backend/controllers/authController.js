import { createUser, getUserByUsername } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Pegamos a variável do .env
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Registrar usuário
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Campos obrigatórios: username, password" });
  }

  try {
    // Verifica se usuário já existe
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    // Criptografa a senha e cria usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ username, password: hashedPassword });
    
    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ 
      error: "Erro ao registrar usuário", 
      details: error.message 
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Campos obrigatórios: username, password" });
  }

  try {
    // Busca usuário
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verifica senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    // Gera token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

// Verificar token
export const verifyToken = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

    const token = authHeader.split(" ")[1]; // pega só o token
    if (!token) return res.status(401).json({ error: "Token ausente" });

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({ valid: true, user: decoded }); // retorna usuário decodificado
  } catch (err) {
    res.status(401).json({ valid: false, error: "Token inválido ou expirado" });
  }
};