import mysql from 'mysql2';

let connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root@12345",
  database: "order_management"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

export default connection.promise();