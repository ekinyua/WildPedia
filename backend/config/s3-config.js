const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const multer = require('multer')
const path = require('path')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

// initializing S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// multer-s3 storage engine
const s3Storage = multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `species-images/${uniqueSuffix}${ext}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
});


// filtering for image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// multer upload middleware
const uploadToS3 = multer({
    storage: s3Storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Function to delete an object from S3
const deleteFromS3 = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        // Extract the key from the URL
        const urlParts = new URL(imageUrl);
        const key = urlParts.pathname.substring(1); // Remove leading slash

        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        });

        await s3Client.send(command);
        console.log(`Successfully deleted ${key} from S3`);
    } catch (error) {
        console.error(`Error deleting from S3: ${error.message}`);
        throw error;
    }
};

module.exports = {
    uploadToS3,
    deleteFromS3,
    s3Client
};