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
        Favorites.find({ 'user': req.user._id })
            .then((favorites) => {

                req.body.user = req.user._id;
                console.log(favorites);
                
                if (favorites) {
                    console.log(favorites);
                    
                    if (favorites.dishes.indexOf(req.body._id) == -1) {
                        favorites.dishes.push(req.body._id);
                        favorites.save()
                            .then((favorites) => {
                                console.log("Successfully added favorite!");
                                res.json(favorites);
                            }, (err) => next(err));
                    } else {
                        console.log('Favorite is existing!');
                        res.json(favorites);
                    }

                } else {

                    Favorites.create({ user: req.body.user })
                        .then((favorites) => {
                            favorites.dishes.push(req.body._id);
                            favorites.save()
                                .then((favorites) => {
                                    console.log('Favorite is existing!');
                                    res.json(favorites);
                                }, (err) => next(err));
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
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
        Favorites.find({ 'user': req.user._id })
            .then((favorites) => {

                req.body.user = req.user._id;

                if (favorites) {
                    if (favorites[0].dishes.indexOf(req.params.dishId) == -1) {
                        favorites[0].dishes.push(req.params.dishId);
                        favorites[0].save()
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

                if (favorites !== null) {
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
                    }else {
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