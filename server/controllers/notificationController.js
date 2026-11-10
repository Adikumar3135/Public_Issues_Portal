import Notification from "../models/Notification.js";

export async function getMyNotifications(req, res,next) {
    try{
        const page = Math.max(
            1,
            Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            50,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
        );

        const filter = {
            recipient: req.user._id
        };

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .populate("complaint","complaintId title status")
                .sort({ createdAt: -1})
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

                Notification.countDocuments(filter),
                Notification.countDocuments({
                    ...filter,
                    isRead: false
                })
        ]);

        return res.status(200).json({
            success: true,
            pagination:{
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            unreadCount,
            notifications
        });
    }catch(error){
        next(error);
    }
}


export async function markNotificationAsRead(req, res, next){
    try{
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id
        });

        if(!notification){
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        if(notification.isRead){
            return res.status(200).json({
                success: true,
                message: "Notification is already read"
            });
        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification:{
                id: notification._id,
                isRead: notification.isRead
            }
        });
    }catch(error){
        if(error.name === "CastError"){
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }
        next(error);
    }
}