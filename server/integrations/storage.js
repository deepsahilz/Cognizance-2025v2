const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const logger = require("../config/logger");

// Storage directories
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PROJECT_DIR = path.join(UPLOAD_DIR, "projects");
const SUBMISSION_DIR = path.join(UPLOAD_DIR, "submissions");
const DISPUTE_DIR = path.join(UPLOAD_DIR, "disputes");
const PROFILE_DIR = path.join(UPLOAD_DIR, "profiles");

// Ensure directories exist
function ensureDirectories() {
  const dirs = [
    UPLOAD_DIR,
    PROJECT_DIR,
    SUBMISSION_DIR,
    DISPUTE_DIR,
    PROFILE_DIR,
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Initialize storage
ensureDirectories();

/**
 * Save a file to the local filesystem
 * @param {Object} file - Express file upload object
 * @param {string} type - File type (project, submission, dispute, profile)
 * @param {string} id - Related entity ID
 * @returns {Object} - Stored file info
 */
exports.saveFile = async (file, type, id) => {
  try {
    // Generate a unique filename
    const fileExt = path.extname(file.name);
    const fileName = `${id}-${uuidv4()}${fileExt}`;

    // Determine directory
    let directory;
    let urlPath;

    switch (type) {
      case "project":
        directory = PROJECT_DIR;
        urlPath = "/uploads/projects";
        break;
      case "submission":
        directory = SUBMISSION_DIR;
        urlPath = "/uploads/submissions";
        break;
      case "dispute":
        directory = DISPUTE_DIR;
        urlPath = "/uploads/disputes";
        break;
      case "profile":
        directory = PROFILE_DIR;
        urlPath = "/uploads/profiles";
        break;
      default:
        directory = UPLOAD_DIR;
        urlPath = "/uploads";
    }

    // Full path
    const filePath = path.join(directory, fileName);

    // Move file
    await file.mv(filePath);

    // Return file info
    return {
      name: file.name,
      url: `${urlPath}/${fileName}`,
      type: file.mimetype,
      size: file.size,
      storedName: fileName,
    };
  } catch (error) {
    logger.error(`File upload error: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a file
 * @param {string} url - File URL
 * @returns {boolean} - Success status
 */
exports.deleteFile = async (url) => {
  try {
    // Get file path from URL
    const filePath = path.join(process.cwd(), "public", url);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete file
      fs.unlinkSync(filePath);
      return true;
    }

    return false;
  } catch (error) {
    logger.error(`File deletion error: ${error.message}`);
    return false;
  }
};

/**
 * Process multiple file uploads
 * @param {Object} files - Express files object
 * @param {string} type - File type (project, submission, dispute, profile)
 * @param {string} id - Related entity ID
 * @returns {Array} - Array of file info objects
 */
exports.processFiles = async (files, type, id) => {
  // Handle case where files is null
  if (!files) return [];

  // Process single file or array of files
  if (files.file) {
    if (Array.isArray(files.file)) {
      // Multiple files
      const uploads = [];

      for (const file of files.file) {
        const fileInfo = await this.saveFile(file, type, id);
        uploads.push(fileInfo);
      }

      return uploads;
    } else {
      // Single file
      const fileInfo = await this.saveFile(files.file, type, id);
      return [fileInfo];
    }
  } else {
    // Multiple fields with potentially multiple files
    const uploads = [];

    for (const key of Object.keys(files)) {
      if (Array.isArray(files[key])) {
        for (const file of files[key]) {
          const fileInfo = await this.saveFile(file, type, id);
          uploads.push(fileInfo);
        }
      } else {
        const fileInfo = await this.saveFile(files[key], type, id);
        uploads.push(fileInfo);
      }
    }

    return uploads;
  }
};