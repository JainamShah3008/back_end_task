const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadTo = (folderName) => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const dir = path.join("uploads", folderName);

      // Create folder if not exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },

    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });

  return multer({ storage });
};

module.exports = uploadTo;
