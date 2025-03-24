import express from "express";
import cors from "cors";
import { setupSwagger } from "./config/swagger.js";
import cookieParser from "cookie-parser";

import usuarioRoutes from "./routes/usuario.routes.js";
import rolRoutes from "./routes/rol.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mascotaRoutes from "./routes/mascota.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/mascotas", mascotaRoutes);
app.use("/api/auth", authRoutes);

setupSwagger(app);

app.use((res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;