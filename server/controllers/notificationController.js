const notificationService = require("../services/notificationService");

// @desc    Get notifications for logged in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    // Get query parameters
    const { limit, skip, unreadOnly } = req.query;

    // Get notifications
    const result = await notificationService.getUserNotifications(req.user.id, {
      limit: parseInt(limit) || 20,
      skip: parseInt(skip) || 0,
      unreadOnly: unreadOnly === "true",
    });

    res.status(200).json({
      success: true,
      count: result.total,
      unread: result.unread,
      data: result.notifications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids) {
      return res.status(400).json({
        success: false,
        error: "Please provide notification IDs",
      });
    }

    // Mark as read
    const result = await notificationService.markAsRead(req.user.id, ids);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    // Mark all as read
    const result = await notificationService.markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    // Delete notification
    const result = await notificationService.deleteNotification(
      req.user.id,
      req.params.id
    );

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
