const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  passwordChangedAt: { type: Date }, // Field to track when the password was last changed
  passwordResetToken: { type: String }, // Token for password reset
  passwordResetExpires: { type: Date }, // Expiry time for the reset token
});

// Virtual field for confirmPassword
UserSchema.virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only validate during new user creation
  if (this.isNew) {
    if (this.password !== this._confirmPassword) {
      return next(new Error("Passwords do not match"));
    }
  }

  // Only hash the password if it's being modified
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Update passwordChangedAt when password is modified
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // Handle token lag
  }

  next();
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to check if password has been changed after the token was issued
UserSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  // False means password has not been changed
  return false;
};

// Generate password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Store hashed version of the token in the database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token valid for 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
