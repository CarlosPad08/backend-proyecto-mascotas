import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "secretoSuperSeguro";

export const generarToken = (usuario) => {
  return jwt.sign(
    { usuario_id: usuario.usuario_id, email: usuario.email },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

export const verificarToken = (token) => {
    try {
      if (!token) {
        console.error("Error: No se recibió ningún token");
        return null;
      }
  
      if (!SECRET_KEY) {
        console.error("Error: SECRET_KEY no está definida");
        return null;
      }
  
      const decode = jwt.verify(token, SECRET_KEY);
      
      return decode.usuario_id;
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      return null;
    }
};
  
