import swaggerDocs from "./config/swagger.js";
import app from "./app.js";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3000;

dotenv.config();
swaggerDocs(app);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});