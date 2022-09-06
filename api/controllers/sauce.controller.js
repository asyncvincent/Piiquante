const sauceModel = require('../models/sauce');
const fs = require('fs');

module.exports = {

    Create: (req, res) => {

        // Get sauce object from request body
        const sauce = JSON.parse(req.body.sauce);

        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        // Create new sauce object
        const sauceSchema = new sauceModel({
            ...sauce,
            imageUrl: imageUrl
        });

        // Save new sauce object in database
        sauceSchema.save()
            .then(() => res.status(200).json({
                message: `La sauce ${sauce.name} a bien été ajoutée !`
            }))
            .catch(error => res.status(400).json({
                message: error
            }));
    },

    Update: (req, res) => {

        // Get sauce object from database
        sauceModel.findOne({ _id: req.params.id })
            .then(sauce => {

                // Check if sauce name has changed
                if (sauce.name !== req.body.name) {

                    // Check if sauce name is already used
                    sauceModel.findOne({ name: req.body.name })
                        .then(sauce => {

                            // If sauce name is already used
                            if (sauce) {
                                return res.status(400).json({
                                    message: `Le nom de la sauce ${req.body.name} est déjà utilisé !`
                                });
                            }

                            // If sauce name is not already used
                            else {

                                // Get sauce object 
                                const sauce = req.file ? { ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` } : { ...req.body };

                                // Update sauce object in database
                                sauceModel.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
                                    .then(() => res.status(200).json({
                                        message: `La sauce ${sauce.name} a bien été modifiée !`
                                    }))
                                    .catch(error => res.status(400).json({
                                        message: error
                                    }));
                            }
                        })
                        .catch(error => res.status(400).json({
                            message: error
                        }));
                }
            })

    },

    Delete: (req, res) => {

        // Get sauce object from database
        sauceModel.findOne({ _id: req.params.id })
            .then(sauce => {

                // Get sauce image filename
                const filename = sauce.imageUrl.split('/images/')[1];

                // Delete sauce object from database
                sauceModel.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({
                        message: `La sauce ${sauce.name} a bien été supprimée !`
                    }))
                    .then(() => {

                        // Delete sauce image from server
                        fs.unlink(`images/${filename}`, (error) => {
                            if (error) throw error;
                        })
                    })
                    .catch(error => res.status(400).json({
                        message: error
                    }));
            })
            .catch(error => res.status(400).json({
                message: error
            }));
    },

    GetOne: (req, res) => {

        // Get sauce object from database
        sauceModel.findOne({ _id: req.params.id })
            .then(sauce => res.status(200).json(sauce))
            .catch(error => res.status(400).json({
                message: error
            }));
    },

    GetAll: (req, res) => {

        // Get all sauce objects from database
        sauceModel.find()
            .then(sauces => res.status(200).json(sauces))
            .catch(error => res.status(400).json({
                message: error
            }));
    },

    LikeAndDislike: (req, res) => {

        // Get sauce object from database
        sauceModel.findOne({ _id: req.params.id })
            .then(sauce => {

                // Get user id
                const userId = req.body.userId;

                // Get user like
                const like = req.body.like;

                // If user likes sauce
                if (like === 1) {

                    // If user has not already liked sauce
                    if (!sauce.usersLiked.includes(userId)) {

                        // Add user id to usersLiked array
                        sauce.usersLiked.push(userId);

                        // Increment likes
                        sauce.likes++;
                    }
                }

                // If user dislikes sauce
                if (like === -1) {

                    // If user has not already disliked sauce
                    if (!sauce.usersDisliked.includes(userId)) {

                        // Add user id to usersDisliked array
                        sauce.usersDisliked.push(userId);

                        // Increment dislikes
                        sauce.dislikes++;
                    }
                }

                // If user removes like or dislike
                if (like === 0) {

                    // If user has liked sauce
                    if (sauce.usersLiked.includes(userId)) {

                        // Remove user id from usersLiked array
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);

                        // Decrement likes
                        sauce.likes--;
                    }

                    // If user has disliked sauce
                    if (sauce.usersDisliked.includes(userId)) {

                        // Remove user id from usersDisliked array
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);

                        // Decrement dislikes
                        sauce.dislikes--;
                    }
                }

                // Update sauce object 
                sauceModel.updateOne({ _id: req.params.id }, sauce)
                    .then(() => res.status(200).json({
                        message: `La sauce ${sauce.name} a bien été modifiée !`
                    }))
                    .catch(error => res.status(400).json({
                        message: error
                    }));
            })
            .catch(error => res.status(400).json({
                message: error
            }));
    }
}