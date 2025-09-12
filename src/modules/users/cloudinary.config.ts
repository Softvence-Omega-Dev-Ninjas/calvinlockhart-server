import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';




// Correctly typed storage
// export const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: `${process.cwd()}`, // folder in Cloudinary
//       format: 'png',   // convert to png
//       public_id: file.originalname.split('.')[0], // optional: set custom file name
//       transformation: [{ width: 500, height: 500, crop: 'limit' }],
//     };
//   },
// });