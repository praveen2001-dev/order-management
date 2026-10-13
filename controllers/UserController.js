import userModel from "../model/UserModel.js";

export const createUser = async function (req, resp) {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return resp.status(400).json({
                message: "Name and email are required",
                status: false
            });
        }

        const userExist = await userModel.findUserByEmail(email);

        if (userExist.length > 0) {
            return resp.status(409).json({
                message: "User already exists",
                status: false
            });
        }

        const result = await userModel.createUser({ name, email });

        return resp.status(201).json({
            message: "User created successfully",
            status: true,
            userId: result.insertId
        });
    } catch (error) {
        return resp.status(500).json({
            message: "User has not been created",
            status: false,
            error: error.message
        });
    }
};
