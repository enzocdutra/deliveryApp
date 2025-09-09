import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductsByCategory,
} from "../controllers/productController.js";

const router = Router();

// Lista todos
router.get("/", listProducts);

// Lista por categoria (precisa vir antes de :id)
router.get("/category/:categoria", listProductsByCategory);

// Busca por ID
router.get("/:id", getProduct);

// Criar
router.post("/create", createProduct);

// Atualizar
router.put("/:id", updateProduct);

// Deletar
router.delete("/:id", deleteProduct);

export default router;
