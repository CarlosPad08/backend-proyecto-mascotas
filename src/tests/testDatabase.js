import { turso } from "../config/database.js";

async function testConnection() {
  try {
    const result = await turso.execute("SELECT 1 AS test");
    console.log("Conexión exitosa ✅", result.rows);
  } catch (error) {
    console.error("Error de conexión ❌", error);
  }
}

testConnection();