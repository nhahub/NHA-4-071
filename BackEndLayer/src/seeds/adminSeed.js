const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const User = require("../models/User");

const ADMIN_DATA = {
  name: "Admin",
  email: "admin@morshed.com",
  universityId: "AD001",
  password: "Admin000@morshed",
  role: "admin",
};

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(
        `Removing existing admin: ${existingAdmin.universityId} (${existingAdmin.email})`,
      );
      await User.deleteMany({ role: "admin" });
      console.log("Existing admin(s) removed");
    }

    if (await User.findOne({ universityId: "AD001" })) {
      console.log("AD001 is taken, falling back to AD000");
      ADMIN_DATA.universityId = "AD000";
    }

    const newAdmin = await User.create(ADMIN_DATA);
    console.log("\n=== ADMIN CREATED SUCCESSFULLY ===");
    console.log(`  University ID: ${newAdmin.universityId}`);
    console.log(`  Email:         ${newAdmin.email}`);
    console.log(`  Password:      ${ADMIN_DATA.password}`);
    console.log(`  Name:          ${newAdmin.name}`);
    console.log(`  Role:          ${newAdmin.role}`);
    console.log(`  ID (MongoDB):  ${newAdmin._id}`);
    console.log("==================================\n");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAdmin();
