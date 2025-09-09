import { Router } from "express";
import { registerUser, loginUser,verifyToken} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyToken); // <- aqui
export default router;
