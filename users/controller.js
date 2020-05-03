const express = require('express');
const router = express.Router();
const userService = require('./service');

// routes
router.post('/login', register);
router.get('/getAll', getAll);
router.post('/reAuthenticate', reAuthenticate);
router.delete('/delete/:id', deleteUser)

module.exports = router;

function register(req, res, next) {
    userService.create(req.body)
    .then(() => res.json({
        message: "User successfully created.",
        responseCode: 200,
        user: (user)
    }))
    .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    userService.deleteUser(req.params.id)
        .then(() => res.json({
            message: "User successfully deleted.",
            responseCode: 200,
        }))
        .catch(err => next(err));
}

function reAuthenticate(req, res, next) {
    userService.reAuthenticate(req.body)
        .then(user => user ? res.json({
            message: "User successfully authenticated.",
            responseCode: 200,
            user: (user)
        }) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
