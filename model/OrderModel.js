import db from "../config/db.js";

const Order = {};

Order.createOrder = async function (orderdata) {
    const insertOrder = {
        user_id: orderdata.user_id || '',
        status: orderdata.status || 'CREATED',
        total_amount: orderdata.total_amount || 0,
    };

    try {
        const [result] = await db.query("INSERT INTO orders SET ?", insertOrder);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.findOrderById = async function (orderId, forUpdate = false) {
    try {
        const querySQL = forUpdate? "SELECT * FROM orders WHERE id = ? FOR UPDATE" : "SELECT * FROM orders WHERE id = ?";        
        const [result] = await db.query(querySQL, [orderId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.findProductById = async function (productId, forUpdate = false) {
    try {
        const querySQL = forUpdate ? "SELECT * FROM products WHERE id = ? FOR UPDATE" : "SELECT * FROM products WHERE id = ?";
        const [result] = await db.query(querySQL, [productId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.findOrderItem = async function (orderId, productId, forUpdate = false) {
    try {
        const sql = forUpdate ? `SELECT * FROM order_items WHERE order_id = ? AND product_id = ? FOR UPDATE` : `SELECT * FROM order_items WHERE order_id = ? AND product_id = ?`;
        const [result] = await db.query(sql, [orderId, productId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.createOrderItem = async function (itemData) {
    try {
        const [result] = await db.query("INSERT INTO order_items SET ?", itemData);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.updateOrderItemQuantity = async function (itemId, quantity) {
    try {
        const [result] = await db.query("UPDATE order_items SET quantity = ? WHERE id = ?", [quantity, itemId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.deleteOrderItem = async function (orderId, productId) { 
    try {
        const [result] = await db.query("DELETE FROM order_items WHERE order_id = ? AND product_id = ?", [orderId, productId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.updateStock = async function (productId, quantity) {
    try {
        const [result] = await db.query("UPDATE products SET stock = stock + ? WHERE id = ?", [quantity, productId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.decreaseStock = async function (productId, quantity) {
    try {
        const [result] = await db.query(`UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`, [quantity, productId, quantity]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.calculateOrderTotal = async function (orderId) {
    try {
        const [result] = await db.query(`SELECT COALESCE(SUM(quantity * price), 0) AS total FROM order_items WHERE order_id = ?`, [orderId]);
        return Number(result[0].total);
    } catch (err) {
        if (err) throw err;
    }
};

Order.updateOrderTotal = async function (orderId, total) {
    try {
        const [result] = await db.query("UPDATE orders SET total_amount = ? WHERE id = ?", [total, orderId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.getOrderDetails = async function (orderId) {
    try {
        const [result] = await db.query(`SELECT o.id, o.user_id, u.email, o.status, o.total_amount FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?`, [orderId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.getOrderItems = async function (orderId) {
    try {
        const [result] = await db.query(`SELECT oi.product_id, p.name AS product_name, oi.quantity, oi.price, (oi.quantity * oi.price) AS item_total FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`, [orderId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

Order.updateOrderStatus = async function (orderId, status) {
    try {
        const [result] = await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};

export default Order;
