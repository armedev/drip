import { Router } from "express";
import { list, detail, create, remove } from "../controllers/product.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();
router.get("/", list);
router.get("/:id", detail);
router.post("/", upload.single("image"), create);
router.delete("/:id", remove);
export default router;
