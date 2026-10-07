import express from 'express';
import { createOrder, addItem, removeItem, getOrder, updateStatus } from "./controllers/UserController.js";

const router = express.Router();

router.post('/', createOrder);
// router.post("/:orderId/items", addItem);
// router.delete("/:orderId/items/:productId", removeItem);
// router.get("/:orderId", getOrder);
// router.put("/:orderId/status", updateStatus);

export default router;