import { Router } from "express";
import { 
  listProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  listProductsByCategory 
} from "../controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/categoria/:categoria", listProductsByCategory);

export default router;