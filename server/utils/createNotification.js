import Notification from "../models/Notification.js";

export async function createNotification({
    recipient,
    complaint = null,
    type,
    title,
    message
}) {
    if (!recipient || !type || !title || !message) {
        throw new Error("Required notification fields are missing");
    }

    return Notification.create({
        recipient,
        complaint,
        type,
        title,
        message
    });
}
