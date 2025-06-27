import express from "express";
import sequelize from "./db/database.js";
import { initDatabase } from "./models/user.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", attendanceRoutes);

async function startServer() {
  try {
    const result = await sequelize.sync(); 
    console.log("Sequelize synced");

    await initDatabase(); 

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
