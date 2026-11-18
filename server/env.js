// Load variables from a local .env file if present (Node 20.12+ built-in, no dotenv needed).
import fs from "node:fs";

if (fs.existsSync(".env") && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(".env");
}
