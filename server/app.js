
import express from "express";
import cors from "cors";
import helmet from "helmet";
import {
    notFound,
    errorHandler
} from "./middleware/errorMiddleware.js";
import authRouters from "./routes/authRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import complaintRoutes from "./routes/createComplaint.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import mongoSanitize from "express-mongo-sanitize";


const app = express();


const allowedOrigins = (
    process.env.CLIENT_URL || "https://publicissuesportal.vercel.app/"
).split(",").map((origin) => origin.trim());

app.use(helmet());

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false
    })
);
// Security and request middleware

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
// Express 5 exposes req.query through a getter; make it writable for the sanitizer.

app.use((req, res, next) => {
    Object.defineProperty(req, "query", {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true
    });

    next();
});
app.use(mongoSanitize());

// Health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Public Issue Portal API is running"
    });
});

app.use("/api/auth", authRouters);
app.use("/api/departments", departmentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
// 404 and error handling
app.use(notFound);
app.use(errorHandler);

export default app;
