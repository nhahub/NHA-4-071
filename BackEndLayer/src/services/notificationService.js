const Notification = require("../models/Notification");

exports.createNotification = async (userId, type, title, message) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
  });
  return notification;
};

exports.getNotifications = async (userId) => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 });
  return notifications.map((n) => ({
    _id: n._id,
    userId: n.userId,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read,
    date: n.createdAt,
  }));
};

exports.markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { returnDocument: "after" },
  );
  if (!notification) throw new Error("Notification not found");
  return notification;
};
