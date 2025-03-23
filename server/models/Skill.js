const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a skill name"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    enum: [
      "Development",
      "Design",
      "Marketing",
      "Writing",
      "Business",
      "Other",
    ],
    default: "Other",
  },
});

module.exports = mongoose.model("Skill", SkillSchema);