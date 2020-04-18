module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.json({
            message: err,
            responseCode: 400
        });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.json({
            message: err.message,
            responseCode: 400
        });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.json({
            message: "Invalid token",
            responseCode: 401
        });
    }

    // default
    return res.json({
        message: err.message,
        responseCode: 500
    });
}