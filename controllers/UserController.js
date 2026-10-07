import userModel from '../model/UserModel.js'

const UserController = {
    signUpUser: async function (req, resp) {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return resp.status(500).json({ message: "Name and email are required" });
            }
            const userData = { name: name, email: email };
            console.log(userData);
            const result = await userModel.createUser(userData);
            console.log(result);
            // return resp.status(201).json({message: "User created successfully", userId: result.insertId});
        } catch (error) {
            return resp.status(500).json({message: error.message});
        }
    }
};

export default UserController;