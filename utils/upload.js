const axios = require("axios");
const ImageKit = require("imagekit");
const fs = require("fs");

const { createLogFile } = require("../utils/create_logs");

const file_name = "upload";
const file_path = "utils";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports.uploadToImageKit = async (filePath) => {
  try {
    const uploadResponse = await imagekit.upload({
      file: fs.readFileSync(filePath),
      fileName: `post_${Date.now()}.jpg`,
      folder: "/posts",
    });

    return {
      status: true,
      url: uploadResponse.url,
    };
  } catch (err) {
    await createLogFile("uploadToImageKit", err, file_name, file_path);

    return {
      status: false,
      message: err.message,
    };
  }
};
