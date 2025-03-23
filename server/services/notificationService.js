const Notification = require("../models/Notification");
const logger = require("../config/logger");

/**
 * Create a notification
 * @param {Object} notification - Notification data
 * @returns {Object} - Created notification
 */
exports.createNotification = async (notification) => {
  try {
    // Validate required fields
    if (!notification.userId || !notification.type || !notification.message) {
      throw new Error("Missing required notification fields");
    }

    // Create notification
    const newNotification = await Notification.create({
      type: notification.type,
      message: notification.message,
      userId: notification.userId,
      referenceId: notification.referenceId || null,
      referenceModel: notification.referenceModel || null,
      data: notification.data || {},
      createdAt: new Date(),
    });

    // Return created notification
    return newNotification;
  } catch (error) {
    logger.error(`Notification creation error: ${error.message}`);
    throw error;
  }
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Array} - List of notifications
 */
exports.getUserNotifications = async (userId, options = {}) => {
  try {
    const { limit = 20, skip = 0, unreadOnly = false } = options;

    // Create query
    const query = { userId };

    // Add unread filter if requested
    if (unreadOnly) {
      query.isRead = false;
    }

    // Get notifications
    const notifications = await Notification.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Notification.countDocuments(query);

    // Return notifications with count
    return {
      total,
      unread: await Notification.countDocuments({ userId, isRead: false }),
      notifications,
    };
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    throw error;
  }
};

/**
 * Mark notifications as read
 * @param {string} userId - User ID
 * @param {Array|string} notificationIds - Notification ID(s) to mark as read
 * @returns {Object} - Update result
 */
exports.markAsRead = async (userId, notificationIds) => {
  try {
    // Handle single ID or array
    const ids = Array.isArray(notificationIds)
      ? notificationIds
      : [notificationIds];

    // Update notifications
    const result = await Notification.updateMany(
      { _id: { $in: ids }, userId },
      { isRead: true }
    );

    return {
      success: true,
      modifiedCount: result.nModified,
    };
  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Object} - Update result
 */
exports.markAllAsRead = async (userId) => {
  try {
    // Update all unread notifications
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    return {
      success: true,
      modifiedCount: result.nModified,
    };
  } catch (error) {
    logger.error(`Mark all as read error: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a notification
 * @param {string} userId - User ID
 * @param {string} notificationId - Notification ID
 * @returns {Object} - Delete result
 */
exports.deleteNotification = async (userId, notificationId) => {
  try {
    // Delete notification
    const result = await Notification.deleteOne({
      _id: notificationId,
      userId,
    });

    return {
      success: result.deletedCount > 0,
    };
  } catch (error) {
    logger.error(`Delete notification error: ${error.message}`);
    throw error;
  }
};
