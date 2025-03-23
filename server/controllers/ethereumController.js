const ethers = require("ethers");
const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Milestone = require("../models/Milestone");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
const contractABI = require("../contracts/Cognizance2025.json").abi;

// Contract configuration
const CONTRACT_ADDRESS = process.env.ETHEREUM_CONTRACT_ADDRESS;
const PROVIDER_URL = process.env.ETHEREUM_PROVIDER_URL;

// Get provider and contract instances
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

// Create project funding
exports.createProjectFunding = async (req, res) => {
  try {
    const { projectId, txHash } = req.body;

    // Verify transaction is confirmed
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return res
        .status(400)
        .json({ success: false, error: "Transaction not found" });
    }

    await tx.wait(1); // Wait for 1 confirmation

    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt.status) {
      return res
        .status(400)
        .json({ success: false, error: "Transaction failed" });
    }

    // Get project details from contract event logs
    const events = await contract.queryFilter(
      contract.filters.ProjectCreated(),
      receipt.blockNumber,
      receipt.blockNumber
    );

    // Find the event matching our transaction
    const event = events.find((e) => e.transactionHash === txHash);
    if (!event) {
      return res
        .status(400)
        .json({ success: false, error: "Project creation event not found" });
    }

    const blockchainProjectId = event.args.projectId.toNumber();

    // Update project in database
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    // Update project status
    project.status = "open";
    await project.save();

    // Create payment record
    await Payment.create({
      project: projectId,
      milestone:
        project.milestones && project.milestones.length > 0
          ? project.milestones[0]
          : null,
      amount: ethers.utils.formatEther(tx.value),
      currency: "ETH",
      status: "escrow",
      employer: req.user.id,
      freelancer: project.freelancerId,
      blockchainTxHash: txHash,
      blockchainContractAddress: CONTRACT_ADDRESS,
      blockchainProjectId: blockchainProjectId,
    });

    // Create notification for freelancer
    await Notification.create({
      type: "payment",
      message: `Project "${project.title}" has been funded and is ready to start`,
      userId: project.freelancerId,
      referenceId: project._id,
      referenceModel: "Project",
    });

    res.status(200).json({
      success: true,
      data: {
        blockchainProjectId,
        txHash,
      },
    });
  } catch (error) {
    console.error("Error in createProjectFunding:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Add milestone funding
exports.addMilestoneFunding = async (req, res) => {
  try {
    const { projectId, milestoneId, blockchainProjectId, txHash } = req.body;

    // Verify transaction
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || !receipt.status) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid transaction" });
    }

    // Get milestone details from event logs
    const events = await contract.queryFilter(
      contract.filters.MilestoneAdded(),
      receipt.blockNumber,
      receipt.blockNumber
    );

    // Find the event matching our transaction
    const event = events.find((e) => e.transactionHash === txHash);
    if (!event) {
      return res
        .status(400)
        .json({ success: false, error: "Milestone event not found" });
    }

    const blockchainMilestoneId = event.args.milestoneId.toNumber();

    // Update milestone in database
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res
        .status(404)
        .json({ success: false, error: "Milestone not found" });
    }

    // Update milestone with blockchain reference
    milestone.blockchainMilestoneId = blockchainMilestoneId;
    milestone.blockchainTxHash = txHash;
    await milestone.save();

    // Create notification for freelancer
    const project = await Project.findById(projectId);
    await Notification.create({
      type: "milestone",
      message: `A new milestone "${milestone.title}" has been added to project "${project.title}"`,
      userId: project.freelancerId,
      referenceId: milestone._id,
      referenceModel: "Milestone",
    });

    res.status(200).json({
      success: true,
      data: {
        blockchainMilestoneId,
        txHash,
      },
    });
  } catch (error) {
    console.error("Error in addMilestoneFunding:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Start milestone
exports.startMilestone = async (req, res) => {
  try {
    const {
      projectId,
      milestoneId,
      blockchainProjectId,
      blockchainMilestoneId,
      txHash,
    } = req.body;

    // Verify transaction
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || !receipt.status) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid transaction" });
    }

    // Update milestone in database
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res
        .status(404)
        .json({ success: false, error: "Milestone not found" });
    }

    // Update milestone status
    milestone.status = "in-progress";
    await milestone.save();

    // Create notification for employer
    const project = await Project.findById(projectId);
    await Notification.create({
      type: "milestone",
      message: `Work has started on milestone "${milestone.title}" for project "${project.title}"`,
      userId: project.employerId,
      referenceId: milestone._id,
      referenceModel: "Milestone",
    });

    res.status(200).json({
      success: true,
      data: {
        milestone: milestone,
      },
    });
  } catch (error) {
    console.error("Error in startMilestone:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Submit for review
exports.submitForReview = async (req, res) => {
  try {
    const {
      projectId,
      milestoneId,
      blockchainProjectId,
      blockchainMilestoneId,
      txHash,
    } = req.body;

    // Verify transaction
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || !receipt.status) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid transaction" });
    }

    // Update milestone in database
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res
        .status(404)
        .json({ success: false, error: "Milestone not found" });
    }

    // Update milestone status
    milestone.status = "under-review";
    await milestone.save();

    // Create notification for employer
    const project = await Project.findById(projectId);
    await Notification.create({
      type: "milestone",
      message: `Milestone "${milestone.title}" for project "${project.title}" has been submitted for review`,
      userId: project.employerId,
      referenceId: milestone._id,
      referenceModel: "Milestone",
    });

    res.status(200).json({
      success: true,
      data: {
        milestone: milestone,
      },
    });
  } catch (error) {
    console.error("Error in submitForReview:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Approve milestone
exports.approveMilestone = async (req, res) => {
  try {
    const {
      projectId,
      milestoneId,
      blockchainProjectId,
      blockchainMilestoneId,
      txHash,
    } = req.body;

    // Verify transaction
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || !receipt.status) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid transaction" });
    }

    // Get payment event from logs
    const events = await contract.queryFilter(
      contract.filters.PaymentReleased(),
      receipt.blockNumber,
      receipt.blockNumber
    );

    // Find the event matching our transaction
    const event = events.find((e) => e.transactionHash === txHash);
    if (!event) {
      return res
        .status(400)
        .json({ success: false, error: "Payment release event not found" });
    }

    // Update milestone in database
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res
        .status(404)
        .json({ success: false, error: "Milestone not found" });
    }

    // Update milestone status
    milestone.status = "completed";
    milestone.completedAt = new Date();
    await milestone.save();

    // Create or update payment record
    let payment = await Payment.findOne({ milestone: milestoneId });
    if (!payment) {
      payment = new Payment({
        project: projectId,
        milestone: milestoneId,
        employer: req.user.id,
        freelancer: milestone.freelancerId,
      });
    }

    payment.amount = ethers.utils.formatEther(event.args.amount);
    payment.currency = "ETH";
    payment.status = "released";
    payment.blockchainTxHash = txHash;
    payment.blockchainContractAddress = CONTRACT_ADDRESS;
    payment.blockchainProjectId = blockchainProjectId;
    payment.blockchainMilestoneId = blockchainMilestoneId;
    payment.releasedAt = new Date();
    await payment.save();

    // Update project completion status
    const project = await Project.findById(projectId);
    project.completedMilestones += 1;
    if (project.completedMilestones >= project.totalMilestones) {
      project.status = "completed";
    }
    await project.save();

    // Create notification for freelancer
    await Notification.create({
      type: "payment",
      message: `Payment for milestone "${milestone.title}" has been released to your wallet`,
      userId: project.freelancerId,
      referenceId: payment._id,
      referenceModel: "Payment",
    });

    res.status(200).json({
      success: true,
      data: {
        payment: payment,
        milestone: milestone,
      },
    });
  } catch (error) {
    console.error("Error in approveMilestone:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Raise dispute
exports.raiseDispute = async (req, res) => {
  try {
    const {
      projectId,
      milestoneId,
      blockchainProjectId,
      blockchainMilestoneId,
      txHash,
      reason,
      description,
    } = req.body;

    // Verify transaction
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || !receipt.status) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid transaction" });
    }

    // Update milestone in database
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res
        .status(404)
        .json({ success: false, error: "Milestone not found" });
    }

    // Update milestone status
    milestone.status = "disputed";
    await milestone.save();

    // Create dispute record
    const project = await Project.findById(projectId);
    const Dispute = mongoose.model("Dispute"); // Assuming you have a Dispute model
    const dispute = await Dispute.create({
      reason,
      description,
      status: "open",
      projectId,
      milestoneId,
      raisedBy: req.user.id,
      blockchainTxHash: txHash,
      blockchainProjectId,
      blockchainMilestoneId,
    });

    // Create notification for other party and admin
    const otherPartyId =
      req.user.id.toString() === project.employerId.toString()
        ? project.freelancerId
        : project.employerId;

    await Notification.create({
      type: "dispute",
      message: `A dispute has been raised for milestone "${milestone.title}" in project "${project.title}"`,
      userId: otherPartyId,
      referenceId: dispute._id,
      referenceModel: "Dispute",
    });

    // Also notify admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        type: "dispute",
        message: `A new dispute requires your attention in project "${project.title}"`,
        userId: admin._id,
        referenceId: dispute._id,
        referenceModel: "Dispute",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        dispute: dispute,
      },
    });
  } catch (error) {
    console.error("Error in raiseDispute:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const blockchainProjectId = req.query.blockchainProjectId;

    if (!blockchainProjectId) {
      // Try to find blockchain project ID from database
      const project = await Project.findById(projectId);
      if (project && project.blockchainProjectId) {
        blockchainProjectId = project.blockchainProjectId;
      } else {
        return res.status(400).json({
          success: false,
          error: "Blockchain project ID is required as a query parameter",
        });
      }
    }

    // Get all events for this project
    const eventTypes = [
      {
        name: "ProjectCreated",
        filter: contract.filters.ProjectCreated(blockchainProjectId),
      },
      {
        name: "MilestoneAdded",
        filter: contract.filters.MilestoneAdded(blockchainProjectId),
      },
      {
        name: "MilestoneStatusChanged",
        filter: contract.filters.MilestoneStatusChanged(blockchainProjectId),
      },
      {
        name: "PaymentReleased",
        filter: contract.filters.PaymentReleased(blockchainProjectId),
      },
      {
        name: "DisputeRaised",
        filter: contract.filters.DisputeRaised(blockchainProjectId),
      },
      {
        name: "DisputeResolved",
        filter: contract.filters.DisputeResolved(blockchainProjectId),
      },
    ];

    // Get events for each type
    const eventPromises = eventTypes.map((eventType) =>
      contract.queryFilter(eventType.filter).then((events) =>
        events.map((event) => ({
          ...event,
          eventName: eventType.name,
        }))
      )
    );

    const eventsArrays = await Promise.all(eventPromises);
    let allEvents = eventsArrays.flat();

    // Sort events by block number and transaction index
    allEvents.sort((a, b) => {
      if (a.blockNumber !== b.blockNumber) {
        return a.blockNumber - b.blockNumber;
      }
      return a.transactionIndex - b.transactionIndex;
    });

    // Format events for display
    const txPromises = allEvents.map(async (event) => {
      const block = await provider.getBlock(event.blockNumber);

      // Format based on event type
      let description = "";
      let amount = null;

      switch (event.eventName) {
        case "ProjectCreated":
          description = "Project created and funded";
          if (event.args && event.args.totalAmount) {
            amount = ethers.utils.formatEther(event.args.totalAmount);
          }
          break;
        case "MilestoneAdded":
          description = `Milestone "${event.args && event.args.title ? event.args.title : ""
            }" added`;
          if (event.args && event.args.amount) {
            amount = ethers.utils.formatEther(event.args.amount);
          }
          break;
        case "MilestoneStatusChanged":
          const statusMap = [
            "Pending",
            "InProgress",
            "UnderReview",
            "Completed",
            "Disputed",
          ];
          const status =
            event.args && event.args.status !== undefined
              ? statusMap[event.args.status] || "Unknown"
              : "Unknown";
          description = `Milestone status changed to ${status}`;
          break;
        case "PaymentReleased":
          description = "Payment released for milestone";
          if (event.args && event.args.amount) {
            amount = ethers.utils.formatEther(event.args.amount);
          }
          break;
        case "DisputeRaised":
          description = "Dispute raised for milestone";
          break;
        case "DisputeResolved":
          description = "Dispute resolved";
          if (event.args && event.args.amount) {
            amount = ethers.utils.formatEther(event.args.amount);
          }
          break;
        default:
          description = event.eventName;
      }

      return {
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: block.timestamp * 1000, // Convert to milliseconds
        eventName: event.eventName,
        description,
        amount,
      };
    });

    const formattedTxs = await Promise.all(txPromises);

    res.status(200).json({
      success: true,
      count: formattedTxs.length,
      data: formattedTxs,
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
