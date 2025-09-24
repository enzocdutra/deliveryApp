import pool from "../config/db.js";

export const getAll = async () => {
  const result = await pool.query("SELECT * FROM produtos ORDER BY id DESC");
  return result.rows;
};

export const getById = async (id) => {
  const result = await pool.query("SELECT * FROM produtos WHERE id = $1", [id]);
  return result.rows[0]; // Retorna o primeiro resultado ou undefined
};

export const create = async ({ nome, descricao, preco, categoria, imagem }) => {
  const result = await pool.query(
    "INSERT INTO produtos (nome, descricao, preco, categoria, imagem) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nome, descricao, preco, categoria, imagem || null]
  );
  return result.rows[0]; // Retorna o produto criado com todos os dados
};

export const update = async ({ id, nome, descricao, preco, categoria, imagem }) => {
  const result = await pool.query(
    "UPDATE produtos SET nome = $1, descricao = $2, preco = $3, categoria = $4, imagem = $5 WHERE id = $6 RETURNING *",
    [nome, descricao, preco, categoria, imagem || null, id]
  );
  return {
    changes: result.rowCount,
    product: result.rows[0] || null
  };
};

export const remove = async (id) => {
  const result = await pool.query("DELETE FROM produtos WHERE id = $1", [id]);
  return { changes: result.rowCount };
};

export const getByCategory = async (categoria) => {
  const result = await pool.query("SELECT * FROM produtos WHERE categoria = $1", [categoria]);
  return result.rows;
};