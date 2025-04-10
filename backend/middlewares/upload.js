// middlewares/upload.js
import multer from 'multer';

const storage = multer.memoryStorage(); // base64 ke liye memory me store karega

export const upload = multer({ storage });
