import { Router } from "express";
import { 
  listProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  listProductsByCategory,
  updateProductStatus
} from "../controllers/productController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id/status", requireAuth, updateProductStatus);
router.delete("/:id", deleteProduct);
router.get("/categoria/:categoria", listProductsByCategory);

export default router;
