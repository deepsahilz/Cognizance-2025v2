const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/env");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["freelancer", "employer", "admin"],
      required: [true, "Please specify a role"],
    },
    profile: {
      bio: String,
      avatar: String,
      location: String,
      website: String,
      socialLinks: {
        linkedin: String,
        github: String,
        twitter: String,
      },
    },
    twoFactorEnabled: {
    type: Boolean,
    default: false
  },
    ethWalletAddress: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid Ethereum address`,
      },
    },
    skills: [String],
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    portfolio: [
      {
        title: String,
        description: String,
        image: String,
        link: String,
      },
    ],

    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      pendingBalance: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
    type: String,
    default: null
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: null
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
    accountStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
savedUsers: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User' 
}],

module.exports = mongoose.model("User", UserSchema);