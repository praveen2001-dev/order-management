import express from 'express';
import OrderController from '../controllers/OrderController.js'
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.post('/orders', OrderController.createOrder);
// router.post("/orders/:orderId/items", OrderController.addItem);
// router.delete("/orders/:orderId/items/:productId", OrderController.removeItem);
// router.get("/orders/:orderId", OrderController.getOrder);
// router.put("/orders/:orderId/status", OrderController.updateStatus);

router.post('/users', UserController.signUpUser);
export default router;