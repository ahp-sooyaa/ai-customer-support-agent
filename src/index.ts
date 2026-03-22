import dotenv from "dotenv";
import express from "express";
import healthRoutes from "./routes/healthRoutes";
import webhookRoutes from "./routes/webhookRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(healthRoutes);
app.use(webhookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
