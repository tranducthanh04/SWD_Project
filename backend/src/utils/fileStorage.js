const fs = require('fs');
const path = require('path');
const multer = require('multer');
const env = require('../config/env');
const AppError = require('./AppError');

const uploadFolders = ['avatars', 'logos', 'cvs'];

const ensureUploadDirectories = () => {
  if (!fs.existsSync(env.uploadDir)) {
    fs.mkdirSync(env.uploadDir, { recursive: true });
  }

  uploadFolders.forEach((folder) => {
    const fullPath = path.join(env.uploadDir, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

const createUploader = ({ folder, allowedMimeTypes, maxSize = 3 * 1024 * 1024 }) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(env.uploadDir, folder));
    },
    filename: (_req, file, cb) => {
      const sanitized = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      cb(null, sanitized);
    },
  });

  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: (_req, file, cb) => {
      if (allowedMimeTypes.some((type) => file.mimetype.startsWith(type))) {
        cb(null, true);
        return;
      }
      cb(new AppError('Unsupported file type', 400));
    },
  });
};

const buildFileUrl = (folder, filename) => `/uploads/${folder}/${filename}`;

module.exports = {
  ensureUploadDirectories,
  createUploader,
  buildFileUrl,
};
