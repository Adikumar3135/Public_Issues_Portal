const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];

export function validateEnv() {
    const missing = requiredEnv.filter((key) => !process.env[key]?.trim());

    if (missing.length) {
        throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }

    if (process.env.JWT_SECRET.trim().length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters long");
    }

    const port = process.env.PORT;
    if (port && (!Number.isInteger(Number(port)) || Number(port) < 1 || Number(port) > 65535)) {
        throw new Error("PORT must be a valid number between 1 and 65535");
    }
}
