import { Router } from "express";
import { get, add, update, remove } from "../controllers/cart.controller";

const router = Router();
router.get("/", get);
router.post("/", add);
router.patch("/:productId", update);
router.delete("/:productId", remove);
export default router;
