import mysql from 'mysql2';
import dotenv from "dotenv";

dotenv.config();

let connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root@12345",
  database: process.env.DB_DATABASE || "order_management"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

export default connection.promise();