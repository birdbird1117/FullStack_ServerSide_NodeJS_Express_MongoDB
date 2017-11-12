var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var Dish = require('../models/dishes');
var Favorite = require('../models/favorite');
var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Favorite.find({'user': req.user._id})
    .populate('user')
    .populate('dishes')
    .then ((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {    
    Favorite.find({'user': req.user._id})
    .then((favorites) => {

        req.body.user = req.user._id;

        if (favorites != null) {
            if (favorites[0].dishes.indexOf(req.body._id) !== -1) {
                favorites[0].dishes.push(req.body._id);
                favorites[0].save()
                .then((favorites) => {
                    console.log("Successfully added favorite!");
                    res.json(favorites);
                }, (err) => next(err));
            } else {
                console.log('Favorite is existing!');
                res.json(favorites);
            }

        } else {

            Favorite.create({user: req.body.user})
            .then((favorite) => {
                favorite.dishes.push(req.body._id);
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite is existing!');
                    res.json(favorite);
                }, (err) => next(err));
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Favorite.remove({'user': req.user._id})
    .then ((favorites) => {
        console.log('Favorites deleted!');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
});



favoriteRouter.route('/:dishId')
.post(authenticate.verifyUser, (req, res, next) => { 
    Favorite.find({'user': req.user._id})
    .then((favorites) => {

        req.body.user = req.user._id;

        if (favorites !== null) {
            if (favorites[0].dishes.indexOf(req.params.dishId) !== -1) {
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

            Favorite.create({user: req.body.user})
            .then((favorite) => {
                favorite.dishes.push(req.body._id);
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite exists!');
                    res.json(favorite);
                }, (err) => next(err));
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Favorite.find({'user': req.user._id})
    .then((favorites) => {

        var favorite = favorites ? favorites[0] : null;
        
        if (favorite) {
            for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                if (favorite.dishes[i] == req.params.dishId) {
                    favorite.dishes.remove(req.params.dishId);
                }
            }
            favorite.save()
            .then((favorite) => {
                console.log('Favorite deleted!');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));

        } else {
            console.log('No favourites!');
            res.statusCode = 200;
            res.json(favorite);
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = favoriteRouter;