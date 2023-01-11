import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import conectarDB from "./config/db";
import patientRoutes from "./routes/patientRoutes";


const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

// const dominiosPermitidos = [process.env.FRONTEND_URL];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (dominiosPermitidos.indexOf(origin) !== -1) {
//       // El Origen del Request esta permitido
//       callback(null, true);
//     } else {
//       callback(new Error("No permitido por CORS"));
//     }
//   },
// };

app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});

