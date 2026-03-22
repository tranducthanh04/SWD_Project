const path = require('path');
const multer = require('multer');
const { createUploader } = require('../utils/fileStorage');
const env = require('../config/env');
const AppError = require('../utils/AppError');

const uploadAvatar = createUploader({
  folder: 'avatars',
  allowedMimeTypes: ['image/'],
});

const uploadLogo = createUploader({
  folder: 'logos',
  allowedMimeTypes: ['image/'],
});

const uploadCv = createUploader({
  folder: 'cvs',
  allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxSize: 5 * 1024 * 1024,
});

const profileAssetStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const folder = file.fieldname === 'cvFile' ? 'cvs' : 'avatars';
    cb(null, path.join(env.uploadDir, folder));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

const uploadProfileAssets = multer({
  storage: profileAssetStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'avatar' && file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }

    if (
      file.fieldname === 'cvFile' &&
      ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].some((type) =>
        file.mimetype.startsWith(type),
      )
    ) {
      cb(null, true);
      return;
    }

    cb(new AppError('Định dạng tệp tải lên cho hồ sơ không được hỗ trợ', 400));
  },
});

module.exports = {
  uploadAvatar,
  uploadLogo,
  uploadCv,
  uploadProfileAssets,
};
