module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.json({
            message: err,
            statusCode: 400
        });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.json({
            message: err.message,
            statusCode: 400
        });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.json({
            message: "Invalid token",
            statusCode: 401
        });
    }

    // default
    return res.json({
        message: err.message,
        statusCode: 500
    });
}