import express from "express";
import dotenv from "dotenv";
import orderRouter from "./routes/order.js";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
