var cloudinary = require("cloudinary").v2;

const config = cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const uploadProfileImage = async (image, email) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: `${email}/profiles`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteProfileImage = async (image, email) => {
    try {
        const result = await cloudinary.uploader.destroy(image, {
            folder: `${email}/profiles`,
            use_filename: true,
            unique_filename: false,
            overwrite: true,
          });
        return result;
    } catch (error) {
        console.log(error);
    }
}




module.exports = { uploadProfileImage, deleteProfileImage };