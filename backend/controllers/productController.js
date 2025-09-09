import * as Product from "../models/productModel.js";
import { isDataUrl } from "../utils/imageBase64.js";

// Listar todos
export const listProducts = (req, res) => {
  Product.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao listar produtos." });
    res.json(rows);
  });
};

// Buscar por ID
export const getProduct = (req, res) => {
  const { id } = req.params;
  Product.getById(id, (err, row) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar produto." });
    if (!row) return res.status(404).json({ error: "Produto não encontrado." });
    res.json(row);
  });
};

// Criar
export const createProduct = (req, res) => {
  const { nome, descricao, preco, categoria, imagem } = req.body;

  if (!nome || !descricao || preco === undefined || !categoria) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, descricao, preco, categoria." });
  }

  if (isNaN(preco) || preco < 0) {
    return res.status(400).json({ error: "Preço inválido." });
  }

  if (imagem && !isDataUrl(imagem)) {
    return res.status(400).json({ error: "Imagem deve estar em Data URL (base64)." });
  }

  Product.create({ nome, descricao, preco, categoria, imagem }, (err, novo) => {
    if (err) return res.status(500).json({ error: "Erro ao criar produto." });
    res.status(201).json(novo);
  });
};

// Atualizar
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, categoria, imagem } = req.body;

  if (!nome || !descricao || preco === undefined || !categoria) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, descricao, preco, categoria." });
  }

  if (isNaN(preco) || preco < 0) {
    return res.status(400).json({ error: "Preço inválido." });
  }

  if (imagem && !isDataUrl(imagem)) {
    return res.status(400).json({ error: "Imagem deve estar em Data URL (base64)." });
  }

  Product.update({ id, nome, descricao, preco, categoria, imagem }, (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar produto." });
    if (result.changes === 0) return res.status(404).json({ error: "Produto não encontrado." });

    // Buscar produto atualizado
    Product.getById(id, (err, row) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar produto atualizado." });
      res.json(row);
    });
  });
};

// Deletar
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  Product.remove(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir produto." });
    if (result.changes === 0) return res.status(404).json({ error: "Produto não encontrado." });
    res.status(200).json({ message: "Produto excluído com sucesso" });
  });
};

// Listar por categoria
export const listProductsByCategory = (req, res) => {
  const { categoria } = req.params;
  Product.getByCategory(categoria, (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao listar produtos por categoria." });
    res.json(rows);
  });
};
