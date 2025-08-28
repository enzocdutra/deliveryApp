import * as Product from "../models/productModel.js";
import { isDataUrl } from "../utils/imageBase64.js";

export const listProducts = (req, res) => {
  Product.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao listar produtos." });
    res.json(rows);
  });
};

export const getProduct = (req, res) => {
  const { id } = req.params;
  Product.getById(id, (err, row) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar produto." });
    if (!row) return res.status(404).json({ error: "Produto não encontrado." });
    res.json(row);
  });
};

export const createProduct = (req, res) => {
  const { nome, descricao, preco, imagem } = req.body;

  if (!nome || !descricao || preco === undefined) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, descricao, preco." });
  }

  if (imagem && !isDataUrl(imagem)) {
    return res.status(400).json({ error: "Imagem deve estar em Data URL (base64)." });
  }

  Product.create({ nome, descricao, preco, imagem }, (err, novo) => {
    if (err) return res.status(500).json({ error: "Erro ao criar produto." });
    res.status(201).json(novo);
  });
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, imagem } = req.body;

  if (!nome || !descricao || preco === undefined) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, descricao, preco." });
  }

  if (imagem && !isDataUrl(imagem)) {
    return res.status(400).json({ error: "Imagem deve estar em Data URL (base64)." });
  }

  Product.update({ id, nome, descricao, preco, imagem }, (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar produto." });
    if (result.changes === 0) return res.status(404).json({ error: "Produto não encontrado." });
    res.json(result);
  });
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  Product.remove(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir produto." });
    if (result.changes === 0) return res.status(404).json({ error: "Produto não encontrado." });
    res.status(204).send();
  });
};
