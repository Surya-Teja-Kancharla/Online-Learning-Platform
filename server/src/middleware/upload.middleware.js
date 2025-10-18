/**
 * Multer Configuration for File Uploads
 * Handles video, PDF, and image uploads with validation
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const coursesDir = path.join(uploadsDir, 'courses');
const videosDir = path.join(coursesDir, 'videos');
const thumbnailsDir = path.join(coursesDir, 'thumbnails');
const documentsDir = path.join(coursesDir, 'documents');

// Create directories
[uploadsDir, coursesDir, videosDir, thumbnailsDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = coursesDir;
    
    // Determine upload path based on file type
    if (file.fieldname === 'video') {
      uploadPath = videosDir;
    } else if (file.fieldname === 'thumbnail') {
      uploadPath = thumbnailsDir;
    } else if (file.fieldname === 'document') {
      uploadPath = documentsDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 50);
    
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

/**
 * File filter for validation
 */
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedVideoTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocumentTypes = /pdf|doc|docx|txt|ppt|pptx/;
  
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  const mimeType = file.mimetype;
  
  // Validate based on field name
  if (file.fieldname === 'video') {
    if (allowedVideoTypes.test(ext) && mimeType.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video format. Allowed: mp4, avi, mov, wmv, flv, mkv, webm'));
    }
  } else if (file.fieldname === 'thumbnail') {
    if (allowedImageTypes.test(ext) && mimeType.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Allowed: jpeg, jpg, png, gif, webp'));
    }
  } else if (file.fieldname === 'document') {
    if (allowedDocumentTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format. Allowed: pdf, doc, docx, txt, ppt, pptx'));
    }
  } else {
    cb(new Error('Unknown file field'));
  }
};

/**
 * Multer upload configuration
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max file size
    files: 5 // Max 5 files per request
  }
});

/**
 * Upload middleware configurations
 */
const uploadConfig = {
  // Single video upload
  video: upload.single('video'),
  
  // Single thumbnail upload
  thumbnail: upload.single('thumbnail'),
  
  // Single document upload
  document: upload.single('document'),
  
  // Multiple fields (video, thumbnail, documents)
  courseFiles: upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  
  // Multiple documents
  documents: upload.array('documents', 5)
};

/**
 * Get file URL from file path
 * @param {string} filePath - File path
 * @returns {string} - Public URL
 */
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // In production, replace with your CDN or cloud storage URL
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const relativePath = filePath.replace(/\\/g, '/').split('uploads/')[1];
  return `${baseUrl}/uploads/${relativePath}`;
};

/**
 * Delete file from filesystem
 * @param {string} filePath - File path to delete
 * @returns {Promise<boolean>}
 */
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      resolve(true);
      return;
    }
    
    // Convert URL to file path if necessary
    let actualPath = filePath;
    if (filePath.startsWith('http')) {
      const urlPath = filePath.split('/uploads/')[1];
      actualPath = path.join(uploadsDir, urlPath);
    }
    
    fs.unlink(actualPath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * Get file size in MB
 * @param {string} filePath - File path
 * @returns {Promise<number>}
 */
const getFileSize = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve((stats.size / (1024 * 1024)).toFixed(2));
      }
    });
  });
};

/**
 * Validate file size
 * @param {object} file - Multer file object
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean}
 */
const validateFileSize = (file, maxSizeMB) => {
  if (!file) return true;
  const fileSizeMB = file.size / (1024 * 1024);
  return fileSizeMB <= maxSizeMB;
};

module.exports = {
  upload,
  uploadConfig,
  getFileUrl,
  deleteFile,
  getFileSize,
  validateFileSize,
  paths: {
    uploadsDir,
    coursesDir,
    videosDir,
    thumbnailsDir,
    documentsDir
  }
};