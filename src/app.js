import express, { json } from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuario.routes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/usuarios", usuarioRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;