import "dotenv/config";
import express from "express";
import { router } from "./routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(router);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Servidor babi.ai rodando na porta ${PORT}`);
});
