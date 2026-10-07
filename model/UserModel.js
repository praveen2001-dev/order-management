
import db from "../config/db.js"

const User = {};

User.createUser = async function (userdata) {
    const insertUser = {
        name: userdata.name || '',
        email: userdata.email || ''
    };

    try {
        const result = await db.query("INSERT INTO users SET ?", insertUser);
        return result;
    } catch (err) {
        console.log(err);
    }
};

User.getUserById = async function (userId, resp) {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
        return result;
    } catch (err) {
        console.log(err);
    }
};


User.findUserByEmail = async function (email, resp) {
    try {
        const result = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return result;
    } catch (err) {
        console.log(err);
    }
};

export default User;