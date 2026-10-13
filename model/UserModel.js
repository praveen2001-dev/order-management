import db from "../config/db.js";

const User = {};

User.createUser = async function (userData) {
    const [result] = await db.query(
        "INSERT INTO users SET ?",
        {
            name: userData.name,
            email: userData.email
        }
    );

    return result;
};

User.findUserById = async function (userId) {
    const [result] = await db.query("SELECT * FROM users WHERE id = ?",[userId]);
    return result;
};

User.findUserByEmail = async function (email) {
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return result;
};

export default User;
