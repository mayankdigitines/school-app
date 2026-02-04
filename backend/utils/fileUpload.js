// Just a simple wrapper for now. 
// Can be expanded to store to S3/Cloudinary later.
import multer from 'multer';
import path from 'path';
import AppError from '../utils/appError.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `file-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow PDFs and Images
  if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Not an image or PDF! Please upload only images or PDF.', 400), false);
  }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;