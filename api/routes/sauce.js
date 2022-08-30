const router = require('express').Router();
const userAuth = require('../middleware/authentication');
const sauceController = require('../controllers/sauce.controller');
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

router.post('/', userAuth, multer({ storage: storage }).single('image'), sauceController.create);
router.put('/:id', userAuth, multer({ storage: storage }).single('image'), sauceController.modify);
router.delete('/:id', userAuth, sauceController.delete);
router.get('/:id', userAuth, sauceController.getOne);
router.get('/', userAuth, sauceController.getAll);
router.post('/:id/like', userAuth, sauceController.likeAndDislike);

module.exports = router;
