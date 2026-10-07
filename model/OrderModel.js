
import db from "../config/db.js"

const Order = {};

Order.createOrder = async function (orderdata) {
    const insertOrder = {
        user_id: orderdata.user_id || '',
        status: orderdata.status || 'Pending',
        total_amount: orderdata.total_amount || 0,
    };

    try {
        const [result] = await db.query("INSERT INTO orders SET ?", insertOrder);
        return result;
    } catch (err) {
        if (err) throw err;
    }
};
export default Order;