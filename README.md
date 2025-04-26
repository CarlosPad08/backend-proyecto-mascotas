
# 🐾 MiMascota – Backend  
Plataforma de Gestión de Veterinarias y Adopciones

---

## 📌 Descripción  
Este repositorio corresponde al **backend** de *MiMascota*, una plataforma web que conecta propietarios de mascotas con veterinarias y fundaciones de adopción. Desde esta rama se gestionan los servicios, controladores, modelos y lógica de negocio de la API que permite operar las funcionalidades principales del sistema.

---

## 🚀 Características del Backend  

- 🔒 **Autenticación y autorización** de usuarios (veterinarias, fundaciones y adoptantes).  
- 🐶 **Gestión de animales para adopción** (registro, edición, eliminación, búsqueda).  
- 🏥 **Historial clínico de mascotas** (consultas, tratamientos, hábitos).  
- 📅 **Agenda de citas veterinarias**, asociadas a clínicas y usuarios.  
- 📈 **Seguimiento de mascotas** con eventos registrados en el tiempo.  
- ⚙️ **Arquitectura modular**, basada en controladores, modelos y rutas.  
- 💬 **Respuestas JSON consistentes** con manejo de errores centralizado.

---

## 🛠️ Tecnologías Utilizadas  

- **Node.js** – Entorno de ejecución del backend  
- **Express.js** – Framework para crear la API REST  
- **Turso** – Base de datos (SQLite moderna con sincronización en edge)  
- **JWT** – Autenticación basada en tokens  
- **Dotenv** – Configuración de variables de entorno  
- **ESLint & Prettier** – Linting y formateo de código  
- **Jest o Supertest (si aplica)** – Pruebas de endpoints

---

## 📁 Estructura del Proyecto  

```
/src
│
├── controllers/       # Lógica de negocio
├── models/            # Acceso y abstracción de datos
├── routes/            # Endpoints organizados por recurso
├── middlewares/       # Validación, autenticación, manejo de errores
├── utils/             # Funciones auxiliares
├── config/            # Configuración general (DB, tokens, etc.)
└── app.js             # Entrada de la aplicación
```

---

## 📚 Uso del Backend  

### ▶️ Iniciar el servidor
```bash
npm install
npm run dev
```

### 📬 Endpoints principales

- `GET /api/adopciones` – Obtener animales disponibles  
- `POST /api/adopciones` – Registrar nuevo animal  
- `GET /api/veterinarias` – Listar clínicas registradas  
- `POST /api/citas` – Agendar una cita médica  
- `GET /api/seguimiento/:id` – Ver evolución de una mascota  

*(ver documentación completa en Postman o Swagger si se incluye)*

---

## 🧪 Pruebas  
> Las pruebas se encuentran en la carpeta `/tests` y cubren los controladores y endpoints principales.

```bash
npm test
```

---

## 🚀 Despliegue  

Este backend puede desplegarse en plataformas como:
- Vercel Serverless Functions (si usas Turso)
- Railway
- Render
- Fly.io

Variables necesarias:  
```
PORT=
DATABASE_URL=
JWT_SECRET=
```

---
