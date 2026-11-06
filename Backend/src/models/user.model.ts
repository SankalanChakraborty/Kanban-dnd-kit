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
  tokenVersion: { type: Number, default: 0 },
  disAllowedRefreshTokens: { type: [revokedTokenSchema], default: [] },
});

const User = mongoose.model("User", userSchema);
export default User;
