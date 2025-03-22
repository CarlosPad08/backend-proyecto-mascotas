import swaggerJsDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Integración de Mascotas",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Documentar rutas
};

const swaggerSpec = swaggerJsDoc(options);

export default (app) => {
  app.use("/api/docs", serve, setup(swaggerSpec));
};
