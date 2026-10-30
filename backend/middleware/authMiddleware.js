import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
