const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

const upload = async (file) => {
  const base64File = file.buffer.toString("base64");
  const result = await imagekit.files.upload({
    file: base64File,
    fileName: file.originalname,
  });

  return result;
};

module.exports = upload;
