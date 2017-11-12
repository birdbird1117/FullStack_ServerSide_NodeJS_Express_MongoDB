var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var Dish = require('../models/dishes');
var Favorites = require('../models/favorite');
var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ 'user': req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (!favorites) {
                    Favorites.create({})
                        .then((favorites) => {
                            console.log(req);                            
                            console.log(req.dishes);                            
                            favorites.user = req.user._id;
                            favorites.dishes = req.body.dishes;
                            favorites.save()
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                                .catch(err => next(err));
                        })
                        .catch(err => next(err));
                } else {
                    for (var i = 0; i < req.body.length; i++) {
                        dishid = req.body[i]._id;
                        if (favorites.dishes.indexOf(dishid) === -1) {
                            favorites.dishes.push(dishid);
                        }
                    }
                    favorites.user = req.user._id;
                    favorites.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));

                }
            })
            .catch(err => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({ 'user': req.user._id })
            .then((favorites) => {
                console.log('Favorites deleted!');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



favoriteRouter.route('/:dishId')
    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ 'user': req.user._id })
            .then((favorites) => {

                req.body.user = req.user._id;
                console.log(favorites);

                if (!favorites) {
                    console.log(favorites);

                    console.log(favorites);

                    if (favorites.dishes.indexOf(req.params.dishId) == -1) {
                        favorites.dishes.push(req.params.dishId);
                        favorites.save()
                            .then((favorites) => {
                                res.json(favorites);
                            }, (err) => next(err));
                    } else {
                        console.log('Favorite exists!');
                        res.json(favorites);
                    }

                } else {

                    Favorites.create({ user: req.body.user })
                        .then((favorites) => {
                            favorites.dishes.push(req.body._id);
                            favorites.save()
                                .then((favorites) => {
                                    console.log('Favorite exists!');
                                    res.json(favorites);
                                }, (err) => next(err));
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ 'user': req.user._id })
            .then((favorites) => {

                //var favorites = favorites ? favorites[0] : null;

                if (!favorites) {
                    /*            for (var i = (favorites.dishes.length - 1); i >= 0; i--) {
                                   if (favorites.dishes[i] == req.params.dishId) {
                                       favorites.dishes.remove(req.params.dishId);
                                   }
                               } */
                    if (favorites[0].dishes.indexOf(req.params.dishId) !== -1) {
                        console.log(favorites[0]);
                        favorites[0].dishes.remove(req.params.dishId);
                        console.log(favorites[0]);

                        favorites[0].save()
                            .then((favorites) => {
                                console.log('Favorite deleted!');
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            }, (err) => next(err));
                    } else {
                        console.log('Favorite does not exist!');
                        res.json(favorites);
                    }
                } else {
                    console.log('No favourites!');
                    res.statusCode = 200;
                    res.json(favorite);
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = favoriteRouter;