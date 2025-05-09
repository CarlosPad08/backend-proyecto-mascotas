import express from "express";
import cors from "cors";
import { setupSwagger } from "./config/swagger.js";
import cookieParser from "cookie-parser";

import usuarioRoutes from "./routes/usuario.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mascotaRoutes from "./routes/mascota.routes.js";
import rolRoutes from "./routes/rol.routes.js";
import animalAdopcionRoutes from "./routes/animal_adopcion.routes.js";
import solicitudAdopcionRoutes from "./routes/solicitudes_adopcion.routes.js";
import refugioRoutes from "./routes/refugio.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotaRoutes);
app.use("/api/animal-adopcion", animalAdopcionRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/solicitudes-adopcion", solicitudAdopcionRoutes);
app.use("/api/refugios", refugioRoutes);

setupSwagger(app);

app.use((req, res, next) => {  
  res.status(404).json({ message: "Ruta no encontrada" });  
});
export default app;
