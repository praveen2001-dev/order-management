import express from "express";
import { createOrder, addItem, removeItem, getOrder, updateStatus} from "../controllers/OrderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.post("/:orderId/items", addItem);
orderRouter.delete("/:orderId/items/:productId", removeItem);
orderRouter.get("/:orderId", getOrder);
orderRouter.put("/:orderId/status", updateStatus);

export default orderRouter;
