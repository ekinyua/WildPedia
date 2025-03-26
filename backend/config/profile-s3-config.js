const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const multer = require('multer')
const path = require('path')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Multer S3 storage engine for profile images
const profileS3Storage = multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `profile-images/profile-${req.user.id}-${uniqueSuffix}${ext}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
});

// Image file filter
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG files are allowed.'), false);
    }
};

// Multer upload middleware for profiles
const uploadProfileToS3 = multer({
    storage: profileS3Storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('profileImage');

// Function to delete a profile image from S3
const deleteProfileFromS3 = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes(process.env.S3_BUCKET_NAME)) return;

    try {
        // Extract the key from the URL
        const urlParts = new URL(imageUrl);
        const key = urlParts.pathname.substring(1); // Remove leading slash

        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        });

        await s3Client.send(command);
        console.log(`Successfully deleted profile image ${key} from S3`);
    } catch (error) {
        console.error(`Error deleting profile image from S3: ${error.message}`);
        throw error;
    }
};

module.exports = {
    uploadProfileToS3,
    deleteProfileFromS3,
    s3Client
};