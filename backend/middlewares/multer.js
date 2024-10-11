import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the current directory equivalent to `__dirname` in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path for the uploads directory
const uploadDir = path.join(__dirname, '../uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory recursively if needed
}

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDir); // Use the upload directory path
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname); // Naming convention for uploaded files
    }
});

// Create Multer instance with the storage configuration
const upload = multer({ storage: storage });

export default upload;
