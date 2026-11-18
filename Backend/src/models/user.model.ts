import mongoose from "mongoose";

const revokedTokenSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: { type: String, select: false },
  passwordResetTokenExpiresAt: { type: Date, select: false },
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpiresAt: { type: Date, select: false },
  emailVerificationSentAt: { type: Date, select: false }, // for the resend cooldown
  tokenVersion: { type: Number, default: 0 },
  disAllowedRefreshTokens: { type: [revokedTokenSchema], default: [] },
  workspace: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);
export default User;
