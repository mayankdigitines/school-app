import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import AppError from './appError.js';
import dotenv from 'dotenv';

// Ensure env vars are loaded
dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage Engine with Strict Typing
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // A. Sanitize filename: remove spaces/special chars, keep it simple
    const originalName = file.originalname.split('.')[0];
    const sanitizedName = originalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const fileName = `${Date.now()}-${sanitizedName}`;

    // B. Base Params
    const params = {
      folder: 'school-app-uploads',
      public_id: fileName,
    };

    // C. Type-Specific Handling
    if (file.mimetype === 'application/pdf') {
      // FIX: Force 'pdf' format so the URL ends with .pdf
      // Cloudinary usually treats PDFs as 'image' resource_type by default, which is fine
      // as long as we force the format.
      params.resource_type = 'auto'; 
      params.format = 'pdf';
    } 
    else if (file.mimetype.startsWith('video')) {
      params.resource_type = 'video';
      params.format = 'mp4'; // Standardize videos to mp4 for better cross-browser support
    } 
    else {
      // Images
      params.resource_type = 'image';
      // params.format = 'webp'; // Optional: You could force auto-conversion to WebP for performance
    }

    return params;
  },
});

// 3. File Filter (Security)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/jpg', 'image/webp',
    'application/pdf',
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only Images, PDFs, and Videos are allowed.', 400), false);
  }
};

// 4. Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB Limit (Videos are heavy)
  },
});

export default upload;