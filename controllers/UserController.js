import userModel from '../model/UserModel.js'

const UserController = {
    signUpUser: async function (req, resp) {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return resp.status(500).json({ message: "Name and email are required" });
            }
            const userData = { name: name, email: email };
            const userExist = await userModel.findUserByEmail(userData.email);
            if (userExist.length === 0) {
                return resp.status(404).json({message: "User already found"});
            }
            
            const result = await userModel.createUser(userData);
            return resp.status(201).json({message: "User created successfully", userId: result.insertId});
        } catch (error) {
            return resp.status(500).json({message: error.message});
        }
    }
};

export default UserController;