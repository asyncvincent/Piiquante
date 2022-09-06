const multer = require('multer');
const uuid = require('uuid').v4;

// Set MIME_TYPES object
const MIME_TYPES = /png|jpeg|jpg/;


// Set storage object
const storage = multer.diskStorage({

    // Set destination function
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    // Set filename function
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + uuid() + '.' + MIME_TYPES.exec(file.mimetype)[0]);
    }
});

// Set multer object
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB

    // Set fileFilter function
    fileFilter: (req, file, callback) => {

        // Check if MIME_TYPE is valid
        const extension = MIME_TYPES.test(file.mimetype);
        if (extension) {
            callback(null, true);
        } else {
            callback(`Le type de fichier ${file.mimetype} n'est pas autorisé !`, null);
        }
    }
});

// Export multer object
module.exports = upload.single('image');