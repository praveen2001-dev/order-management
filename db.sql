CREATE DATABASE IF NOT EXISTS order_management;
USE order_management;

-- Users
CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);

-- Products
CREATE TABLE products (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(150) NOT NULL, price DECIMAL(10,2) NOT NULL, stock INT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);

-- Orders
CREATE TABLE orders (id INT PRIMARY KEY AUTO_INCREMENT, user_id INT NOT NULL, status VARCHAR(20) DEFAULT 'CREATED', total_amount DECIMAL(10,2) DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id));

-- Order Items
CREATE TABLE order_items (id INT PRIMARY KEY AUTO_INCREMENT, order_id INT NOT NULL, product_id INT NOT NULL, quantity INT NOT NULL, price DECIMAL(10,2) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (order_id) REFERENCES orders(id), FOREIGN KEY (product_id) REFERENCES products(id));

-- Sample Users
-- INSERT INTO users (name, email) VALUES
-- ('Praveen Kumar', 'praveen@example.com'),
-- ('Rahul Sharma', 'rahul@example.com');

-- -- Sample Products
-- INSERT INTO products (name, price, stock) VALUES
-- ('Laptop', 55000.00, 10),
-- ('Keyboard', 1500.00, 25),
-- ('Mouse', 800.00, 30),
-- ('Monitor', 12000.00, 15);
