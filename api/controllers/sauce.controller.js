const sauceModel = require('../models/sauce');
const fs = require('fs');

module.exports = {
    create: (req, res) => {
        const sauce = JSON.parse(req.body.sauce);
        delete sauce._id;
        const sauceObject = new sauceModel({
            ...sauce,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        });
        sauceObject.save()
            .then(() => res.status(201).json({ message: 'Sauce created successfully' }))
            .catch(error => res.status(400).json({ error }));
    },

    modify: (req, res) => {
        const sauce = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };
        sauceModel.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modified successfully' }))
            .catch(error => res.status(400).json({ error }));
    },

    delete: (req, res) => {
        sauceModel.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    sauceModel.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce deleted successfully' }))
                        .catch(error => res.status(400).json({ error }));
                });
            })
            .catch(error => res.status(500).json({ error }));
    },

    getOne: (req, res) => {
        sauceModel.findOne({ _id: req.params.id })
            .then(sauce => res.status(200).json(sauce))
            .catch(error => res.status(404).json({ error }));
    },

    getAll: (req, res) => {
        sauceModel.find()
            .then(sauces => res.status(200).json(sauces))
            .catch(error => res.status(400).json({ error }));
    },

    likeAndDislike: (req, res) => {
        const like = req.body.like;
        const userId = req.body.userId;
        const sauceId = req.params.id;
        sauceModel.findOne({ _id: sauceId })
            .then(sauce => {
                if (like === 1) {
                    sauce.usersLiked.push(userId);
                    sauce.likes++;
                } else if (like === -1) {
                    sauce.usersDisliked.push(userId);
                    sauce.dislikes++;
                } else {
                    if (sauce.usersLiked.includes(userId)) {
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                        sauce.likes--;
                    } else if (sauce.usersDisliked.includes(userId)) {
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                        sauce.dislikes--;
                    }
                }
                sauceModel.updateOne({ _id: sauceId }, sauce)
                    .then(() => res.status(200).json({ message: 'Sauce liked/disliked successfully' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(404).json({ error }));
    }
};