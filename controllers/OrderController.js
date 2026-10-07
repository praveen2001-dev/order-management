import orderModel from '../model/OrderModel.js'
import userModel from '../model/UserModel.js'

const OrderController = {
    createOrder: async function (req, resp) {
        try {
            const { userid, status, total_amount } = req.body;
            if (!userid || !status || !total_amount) {
                return resp.send({ message: 'something went wrong', status: false })
            }

            const user = await userModel.findUserById(userid);
            if (user.length === 0) {
                return resp.status(404).json({message: "User not found"});
            }

            if (!userid || !status || !total_amount) {
                return resp.send({ message: 'something went wrong', status: false })
            }

            db.beginTransaction();
            const insertOrder = {
                user_id: userid,
                status: "CREATED",
                total_amount: 0
            }
            const result = await orderModel.createOrder(insertOrder);
            if (result) {
                db.commit();
                return resp.status(200).json({ message: "Order Created Successfully", data: result.insertId });
            } else {
                db.rollback();
                return resp.status(500).json({ message: "Order has not been created" });
            }
        } catch (error) {
            return resp.status(500).json({ message: "Error, Order has not been created", error: error.message || error });

        }
    }
};

export default OrderController;