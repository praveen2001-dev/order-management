
import db from "../config/db.js"

const User = {};

User.createUser = async function (userdata) {
    const insertUser = {
        name: userdata.name || '',
        email: userdata.email || ''
    };
    try {
        const result = await db.query(`INSERT INTO users SET ?`, insertUser);
        return result;
    } catch (err) {
        return console.log(err);
    }
};

User.getUserById = async function (userId, resp) {
    try {
        const [result] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
        return resp.status(201).json({
            message: "User Find Successfully",
            userdata: result.insertId
        });
    } catch (err) {
        return resp.status(500).json({ message: "User Not Found", error: err.message });
    }
};

export default User;