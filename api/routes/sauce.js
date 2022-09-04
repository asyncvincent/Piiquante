const router = require('express').Router();
const Authentication = require('../middleware/authentication').Authentication;
const sauceController = require('../controllers/sauce.controller');
const multer = require('../utils/multer');

// Create new sauce route
router.post('/', Authentication, multer, sauceController.Create);

// Update sauce route 
router.put('/:id', Authentication, multer, sauceController.Update);

// Delete sauce route
router.delete('/:id', Authentication, sauceController.Delete);

// Get one sauces route
router.get('/:id', Authentication, sauceController.GetOne);

// Get all sauces route
router.get('/', Authentication, sauceController.GetAll);

// Like and dislike sauce route
router.post('/:id/like', Authentication, sauceController.LikeAndDislike);

// Export router
module.exports = router;
