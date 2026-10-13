# Order Management System - Backend

Backend Machine Coding Round — Order Management System 
REST API / Machine Coding 

## Stack

- Node.js
- Express.js
- MySQL
- mysql2
- ES Modules

## Setup

1. Create the database using `databases\schema.sql` in MySQL.
2. Put your MySQL credentials in `.env`.
3. Install dependencies:

```bash
npm install
```

5. Start development server:

```bash
npm run dev
```

Server runs on `http://localhost:3000` by default.

## API Endpoints

### 1. Create Order
`POST /api/orders`

Body:

```json
{
  "userid": 1
}
```

The backend always creates the order with `CREATED` status and `total_amount = 0`.

### 2. Add Item

`POST /api/orders/:orderId/items`

Body:

```json
{
  "productId": 1,
  "quantity": 2
}
```

The backend reads the product price and stock from the database. Client price/total is not trusted.

If the same product already exists in the order, its quantity is increased.

### 3. Remove Item

`DELETE /api/orders/:orderId/items/:productId`

Only `CREATED` and `CONFIRMED` orders can be modified. Removed quantity is returned to product stock and the order total is recalculated.

### 4. Get Order

`GET /api/orders/:orderId`

Returns order information, items, product information, quantity, price, item total, and overall total.

### 5. Update Order Status

`PUT /api/orders/:orderId/status`

Body:

```json
{
  "status": "CONFIRMED"
}
```

Allowed transitions:

- `CREATED -> CONFIRMED`
- `CREATED -> CANCELLED`
- `CONFIRMED -> SHIPPED`
- `CONFIRMED -> CANCELLED`
- `SHIPPED -> DELIVERED`
- `DELIVERED` is final
- `CANCELLED` is final

## Architecture

Route
  ↓
Controller
  ↓
Model
  ↓
MySQL

Controllers contain validation and business rules. Models contain database queries.