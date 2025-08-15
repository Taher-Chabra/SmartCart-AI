import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary

const uploadOnCloudinary = async (imgType: 'avatar' | 'product', filePath: string) => {
  try {
    if (!filePath) return null;

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      upload_preset:
        imgType === 'avatar' ? 'smartcartai_avatars' : 'smartcartai_products',
      folder:
        imgType === 'avatar' ? 'smartcartai/avatars' : 'smartcartai/products',
    });

    // Delete the file from local storage after upload
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return uploadResult;
  } catch (error) {
    // Delete the file from local storage as upload operation failed
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error('Error uploading Image to Cloudinary:', error);
    return null;
  }
};

// Delete file from Cloudinary

const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return null;

    // Delete the file from Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    return deleteResult;
  } catch (error) {
    console.error('Error deleting Image from Cloudinary:', error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
