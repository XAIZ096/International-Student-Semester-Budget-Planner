import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db/connection.js";
import budgetRoutes from "./routes/budgets.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (_request, response) => {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/budgets", (_request, response) => {
  response.sendFile(path.join(__dirname, "public", "budgets.html"));
});

app.get("/transactions", (_request, response) => {
  response.sendFile(path.join(__dirname, "public", "transactions.html"));
});

app.get("/about", (_request, response) => {
  response.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    message: "International Student Budget Planner API is running",
  });
});

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

try {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
} catch (error) {
  console.error("Failed to start server", error);
  process.exit(1);
}
