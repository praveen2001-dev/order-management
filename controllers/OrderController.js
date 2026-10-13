import db from "../config/db.js";
import orderModel from "../model/OrderModel.js";
import userModel from "../model/UserModel.js";

const MODIFIABLE_STATUSES = ["CREATED", "CONFIRMED"];
const VALID_STATUSES = ["CREATED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_TRANSITIONS = {
    CREATED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: []
};

export const createOrder = async function (req, resp) {
    try {
        const { userid } = req.body;

        if (!userid) {
            return resp.status(400).json({
                message: "User ID is required",
                status: false
            });
        }

        const user = await userModel.findUserById(userid);

        if (user.length === 0) {
            return resp.status(404).json({
                error: "USER_NOT_FOUND",
                message: "User does not exist",
                status: false
            });
        }

        const result = await orderModel.createOrder({
            user_id: userid
        });

        return resp.status(201).json({
            message: "Order created successfully",
            status: true,
            orderId: result.insertId
        });
    } catch (error) {
        return resp.status(500).json({
            error: "ORDER_NOT_CREATED",
            message: error.message,
            status: false,
        });
    }
};

export const addItem = async function (req, resp) {
    try {
        const orderId = Number(req.params.orderId);
        const { productId, quantity } = req.body;
        const qty = Number(quantity);
        
        if (!Number.isInteger(orderId) || !Number.isInteger(Number(productId))) {
            return resp.status(400).json({
                message: "Valid orderId and productId are required"
            });
        }

        if (!Number.isInteger(qty) || qty <= 0) {
            return resp.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        await db.beginTransaction();

        const order = await orderModel.findOrderById(orderId, true);

        if (order.length === 0) {
            await db.rollback();
            return resp.status(404).json({ error: "ORDER_NOT_FOUND" });
        }

        if (!MODIFIABLE_STATUSES.includes(order[0].status)) {
            await db.rollback();
            return resp.status(409).json({ error:"ORDER_NOT_MODIFIABLE", message: "Order cannot be modified in current status"});
        }

        const product = await orderModel.findProductById(Number(productId), true);

        if (product.length === 0) {
            await db.rollback();
            return resp.status(404).json({ error: "PRODUCT_NOT_FOUND", message: "Product does not exist" });
        }

        const existingItem = await orderModel.findOrderItem(orderId, Number(productId), true);

        const requiredStock = qty;
        if (product[0].stock < requiredStock) {
            await db.rollback();
            return resp.status(409).json({error:"INSUFFICIENT_STOCK ", message: "Insufficient stock"});
        }

        await orderModel.decreaseStock(Number(productId), requiredStock);
        
        if (existingItem.length > 0) {
            const newQuantity = existingItem[0].quantity + qty;
            await orderModel.updateOrderItemQuantity(existingItem[0].id, newQuantity);
        } else {
            await orderModel.createOrderItem({order_id: orderId, product_id: Number(productId), quantity: qty, price: product[0].price});
        }

        const total = await orderModel.calculateOrderTotal(orderId);
        await orderModel.updateOrderTotal(orderId, total);

        await db.commit();

        return resp.status(201).json({ message: "Item added successfully", status: true, total_amount: total });
    } catch (error) {
        await db.rollback();
        return resp.status(500).json({ message: "Item could not be added", status: false, error: error.message});
    }
};

export const removeItem = async function (req, resp) {
    try {
        const orderId = Number(req.params.orderId);
        const productId = Number(req.params.productId);

        if (!Number.isInteger(orderId) || !Number.isInteger(productId)) {
            return resp.status(400).json({
                message: "Valid orderId and productId are required"
            });
        }

        await db.beginTransaction();

        const order = await orderModel.findOrderById(orderId, true);

        if (order.length === 0) {
            await db.rollback();
            return resp.status(404).json({ error: "ORDER_NOT_FOUND", message: "Order not found" });
        }

        if (!MODIFIABLE_STATUSES.includes(order[0].status)) {
            await db.rollback();
            return resp.status(409).json({ error: "ORDER_NOT_MODIFIABLE", message: "Order cannot be modified in current status" });
        }

        const item = await orderModel.findOrderItem(orderId, productId, true);

        if (item.length === 0) {
            await db.rollback();
            return resp.status(404).json({ error:"ORDER_ITEM_NOT_FOUND", message: "Order item not found" });
        }

        await orderModel.deleteOrderItem(orderId, productId);

        // Return removed quantity to product stock.
        await orderModel.updateStock(productId, item[0].quantity);

        const total = await orderModel.calculateOrderTotal(orderId);
        await orderModel.updateOrderTotal(orderId, total);

        await db.commit();

        return resp.status(200).json({ message: "Item removed successfully", status: true, total_amount: total});
    } catch (error) {
        await db.rollback();
        return resp.status(500).json({message: "Item could not be removed", status: false, error: error.message});
    }
};

export const getOrder = async function (req, resp) {
    try {
        const orderId = Number(req.params.orderId);
        if (!Number.isInteger(orderId)) {
            return resp.status(400).json({ message: "Valid orderId is required" });
        }

        const order = await orderModel.getOrderDetails(orderId);
        if (order.length === 0) {
            return resp.status(404).json({ message: "Order not found" });
        }

        const items = await orderModel.getOrderItems(orderId);
        return resp.status(200).json({
            status: true,
            data: {
                ...order[0],
                items
            }
        });
    } catch (error) {
        return resp.status(500).json({
            message: "Could not fetch order",
            error: error.message
        });
    }
};

export const updateStatus = async function (req, resp) {
    try {
        const orderId = Number(req.params.orderId);
        const { status } = req.body;

        if (!Number.isInteger(orderId) || !status) {
            return resp.status(400).json({
                message: "Valid orderId and status are required"
            });
        }

        if (!VALID_STATUSES.includes(status)) {
            return resp.status(400).json({
                message: "Invalid status"
            });
        }

        const order = await orderModel.findOrderById(orderId);
        if (order.length === 0) {
            return resp.status(404).json({ message: "Order not found" });
        }

        const currentStatus = order[0].status;
        const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus];

        if (!allowedNextStatuses.includes(status)) {
            return resp.status(409).json({
                message: `Invalid status transition from ${currentStatus} to ${status}`
            });
        }

        await orderModel.updateOrderStatus(orderId, status);
        return resp.status(200).json({ message: "Order status updated successfully", status: true, orderStatus: status });
    } catch (error) {
        return resp.status(500).json({ message: "Order status could not be updated", status: false, error: error.message });
    }
};