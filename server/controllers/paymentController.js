const Payment = require("../models/Payment");

/**
 * @desc    Get a payment by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: "project",
        select: "title employer freelancer",
      })
      .populate({
        path: "milestone",
        select: "title amount status",
      })
      .populate({
        path: "employer",
        select: "name email",
      })
      .populate({
        path: "freelancer",
        select: "name email",
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    // Check if user is authorized to view this payment
    if (
      payment.employer._id.toString() !== req.user.id &&
      payment.freelancer._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view this payment",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error getting payment:", error);

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * @desc    Get all payments for the logged-in user
 * @route   GET /api/payments
 * @access  Private
 */
exports.getUserPayments = async (req, res) => {
  try {
    let query = {};

    // Filter by user role
    if (req.user.role === "employer") {
      query.employer = req.user.id;
    } else if (req.user.role === "freelancer") {
      query.freelancer = req.user.id;
    }

    const payments = await Payment.find(query)
      .populate({
        path: "project",
        select: "title",
      })
      .populate({
        path: "milestone",
        select: "title amount",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error getting user payments:", error);

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
