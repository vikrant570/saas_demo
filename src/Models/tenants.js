const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    match: [/^[A-Za-z\s]+$/, "Name cannot have numbers or special characters"],
    required: true,
  },
  firmName: {
    type: String,
    match: [
      /^[A-Za-z\s]+$/,
      "Firm's name cannot have numbers or special characters !",
    ],
    required: true,
  },
  firmEmail: {
    type: String,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    required: true,
    unique: true,
  },
  password: {
    type: String,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    ],
    required: true,
  },
  tenantID: {
    type: String,
    match: /^[A-Za-z0-9]+$/,
    required: true,
  },
});

tenantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const bcrypt = require("bcrypt");
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Tenant = mongoose.model("tenants", tenantSchema);
module.exports = Tenant;
