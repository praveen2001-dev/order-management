import express from "express";
import router from "./routes/index.js";
import dotenv from "dotenv";

const app = express();
app.use(express.json());

dotenv.config();
const port = process.env.PORT || 3200;

app.use("/api", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});