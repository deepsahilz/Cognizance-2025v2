const { GoogleGenerativeAI } = require("@google/generative-ai");
const WorkSubmission = require("../models/WorkSubmission");
const Milestone = require("../models/Milestone");
const Notification = require("../models/Notification");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Verify a submission using AI
 * @param {string} submissionId - The ID of the submission to verify
 * @returns {Promise<object>} - The verification result
 */
exports.verifySubmission = async (submissionId) => {
  try {
    // Get the submission
    const submission = await WorkSubmission.findById(submissionId)
      .populate({
        path: "milestoneId",
        select: "title description requiredDeliverables",
        populate: { path: "projectId", select: "title" },
      })
      .populate({ path: "freelancerId", select: "name" });

    if (!submission) {
      throw new Error("Submission not found");
    }

    // Create a prompt for AI verification
    const prompt = createVerificationPrompt(submission);

    // Generate AI response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the AI response
    const aiVerificationResult = parseAIResponse(text);

    // Update the submission with AI verification result
    submission.aiVerification = {
      result: aiVerificationResult.result,
      confidence: aiVerificationResult.confidence,
      feedback: {
        strengths: aiVerificationResult.strengths,
        issues: aiVerificationResult.issues,
        suggestions: aiVerificationResult.suggestions,
      },
      verifiedAt: new Date(),
      escalatedToManual: aiVerificationResult.result === "uncertain",
    };

    await submission.save();

    // Create notifications
    if (aiVerificationResult.result === "uncertain") {
      // Notify admins for manual review
      const admins = await User.find({ role: "admin" });
      for (const admin of admins) {
        await Notification.create({
          type: "submission",
          message: `AI verification is uncertain for submission in project ${submission.milestoneId.projectId.title}. Manual review required.`,
          userId: admin._id,
          referenceId: submission._id,
          referenceModel: "WorkSubmission",
        });
      }
    } else {
      // Notify the employer
      const milestone = await Milestone.findById(
        submission.milestoneId
      ).populate({ path: "projectId", select: "employerId title" });

      await Notification.create({
        type: "submission",
        message: `AI verification ${
          aiVerificationResult.result === "approved" ? "passed" : "failed"
        } for submission in project ${milestone.projectId.title}.`,
        userId: milestone.projectId.employerId,
        referenceId: submission._id,
        referenceModel: "WorkSubmission",
      });
    }

    return submission.aiVerification;
  } catch (error) {
    console.error("AI Verification error:", error);

    // If there's an error, mark the verification as error
    if (submissionId) {
      await WorkSubmission.findByIdAndUpdate(submissionId, {
        "aiVerification.result": "error",
        "aiVerification.verifiedAt": new Date(),
        "aiVerification.feedback.issues": [
          "An error occurred during AI verification",
        ],
      });
    }

    throw error;
  }
};

/**
 * Create a prompt for AI verification
 * @param {object} submission - The submission to verify
 * @returns {string} - The prompt
 */
function createVerificationPrompt(submission) {
  return `
You are an AI verifier for a freelance platform called Cognizance2025. Your task is to verify if a freelancer's submission meets the requirements of a milestone.

Project Title: ${submission.milestoneId.projectId.title}
Milestone Title: ${submission.milestoneId.title}
Milestone Description: ${submission.milestoneId.description}

Required Deliverables:
${submission.milestoneId.requiredDeliverables.map((d) => `- ${d}`).join("\n")}

Freelancer's Submission:
${submission.description}

Attached Files: ${
    submission.attachments.map((a) => a.name).join(", ") || "None"
  }

Based on the above information, please evaluate if the submission meets the requirements:
1. Does the submission address all required deliverables? 
2. Is the submission of professional quality?
3. Does the submission match the milestone description?

Please format your response exactly as follows:

RESULT: [approved/rejected/uncertain]
CONFIDENCE: [0-100]

STRENGTHS:
- [strength 1]
- [strength 2]
...

ISSUES:
- [issue 1]
- [issue 2]
...

SUGGESTIONS:
- [suggestion 1]
- [suggestion 2]
...

ANALYSIS:
[Your detailed analysis here]
`;
}

/**
 * Parse the AI response into a structured object
 * @param {string} response - The AI response text
 * @returns {object} - The parsed result
 */
function parseAIResponse(response) {
  try {
    const result = {};

    // Extract result (approved/rejected/uncertain)
    const resultMatch = response.match(/RESULT:\s*(\w+)/i);
    result.result = resultMatch ? resultMatch[1].toLowerCase() : "uncertain";

    // Extract confidence (0-100)
    const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)/i);
    result.confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;

    // Extract strengths
    result.strengths = [];
    const strengthsSection = response.match(/STRENGTHS:([^]*?)(?:ISSUES:|$)/i);
    if (strengthsSection) {
      const strengths = strengthsSection[1].match(/(?:^|\n)-\s*([^\n]+)/g);
      if (strengths) {
        result.strengths = strengths.map((s) =>
          s.replace(/(?:^|\n)-\s*/, "").trim()
        );
      }
    }

    // Extract issues
    result.issues = [];
    const issuesSection = response.match(/ISSUES:([^]*?)(?:SUGGESTIONS:|$)/i);
    if (issuesSection) {
      const issues = issuesSection[1].match(/(?:^|\n)-\s*([^\n]+)/g);
      if (issues) {
        result.issues = issues.map((i) => i.replace(/(?:^|\n)-\s*/, "").trim());
      }
    }

    // Extract suggestions
    result.suggestions = [];
    const suggestionsSection = response.match(
      /SUGGESTIONS:([^]*?)(?:ANALYSIS:|$)/i
    );
    if (suggestionsSection) {
      const suggestions = suggestionsSection[1].match(/(?:^|\n)-\s*([^\n]+)/g);
      if (suggestions) {
        result.suggestions = suggestions.map((s) =>
          s.replace(/(?:^|\n)-\s*/, "").trim()
        );
      }
    }

    return result;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      result: "uncertain",
      confidence: 0,
      strengths: [],
      issues: ["Error parsing AI response"],
      suggestions: ["Try again or escalate to manual review"],
    };
  }
}

/**
 * Manually override AI verification result
 * @param {string} submissionId - Submission ID
 * @param {string} result - Result (approved/rejected)
 * @param {string} notes - Admin notes
 * @returns {Promise<object>} - Updated verification
 */
exports.manualVerificationOverride = async (submissionId, result, notes) => {
  if (!["approved", "rejected"].includes(result)) {
    throw new Error('Invalid result. Must be "approved" or "rejected"');
  }

  const submission = await WorkSubmission.findById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }

  // Update the AI verification with admin override
  submission.aiVerification = {
    ...submission.aiVerification,
    result,
    manualOverride: true,
    manualOverrideNotes: notes,
    verifiedAt: new Date(),
  };

  await submission.save();
  return submission.aiVerification;
};