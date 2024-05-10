import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination path relative to the current directory
    const destinationPath = join(__dirname, "../public");
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using current timestamp and original filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Combine destination path with the generated filename
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize multer with the defined storage configuration
export const upload = multer({ storage });
