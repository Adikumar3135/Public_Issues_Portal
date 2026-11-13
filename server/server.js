import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";

const PORT = Number(process.env.PORT) || 5000;

try {
  validateEnv();
  await connectDB();

  app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}
