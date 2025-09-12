import { Router } from "express";
import { registerUser, loginUser,verifyToken} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyToken); // <- aqui
router.get("/teste", (req, res) => {
  res.json({ msg: "rota auth ok" });
});

export default router;
