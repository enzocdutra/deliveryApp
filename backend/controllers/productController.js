import * as Product from "../models/productModel.js";
import { isDataUrl } from "../utils/imageBase64.js";

// Listar todos
export const listProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    res.status(500).json({ error: "Erro ao listar produtos." });
  }
};

// Buscar por ID
export const getProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json(product);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
};

// Criar
export const createProduct = async (req, res) => {
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

  try {
    const novoProduto = await Product.create({ nome, descricao, preco, categoria, imagem });
    res.status(201).json(novoProduto);
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({ 
      error: "Erro ao criar produto", 
      details: err.message 
    });
  }
};

// Atualizar
export const updateProduct = async (req, res) => {
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

  try {
    const result = await Product.update({ id, nome, descricao, preco, categoria, imagem });
    
    if (result.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // Retorna o produto atualizado
    if (result.product) {
      res.json(result.product);
    } else {
      // Se não retornou o produto, busca novamente
      const updatedProduct = await Product.getById(id);
      res.json(updatedProduct);
    }
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
};

// Deletar
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await Product.remove(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.status(200).json({ message: "Produto excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    res.status(500).json({ error: "Erro ao excluir produto." });
  }
};

// Listar por categoria
export const listProductsByCategory = async (req, res) => {
  const { categoria } = req.params;
  
  try {
    const products = await Product.getByCategory(categoria);
    res.json(products);
  } catch (err) {
    console.error("Erro ao listar produtos por categoria:", err);
    res.status(500).json({ error: "Erro ao listar produtos por categoria." });
  }
};