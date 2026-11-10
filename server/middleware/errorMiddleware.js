export function notFound(req, res, next) {
    return res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
}

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
    let message = err.message || "Something went wrong";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Request data failed validation";
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID or data type";
    } else if (err.code === 11000) {
        statusCode = 409;
        message = "A record with this value already exists";
    } else if (err.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Invalid JSON request body";
    } else if (err.type === "entity.too.large") {
        statusCode = 413;
        message = "Request body is too large";
    }

    if (process.env.NODE_ENV !== "production") {
        console.error(err);
    }

    return res.status(statusCode).json({
        success: false,
        message: statusCode >= 500 && process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : message
    });
}
