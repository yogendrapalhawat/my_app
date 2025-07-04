// seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./DB.SCHEMA/User.js";
import { College } from "./DB.SCHEMA/College.js";

// 🔐 Load environment variables (for MONGO_URI if needed)
dotenv.config();

// ✅ 1. Connect to MongoDB (local or .env-based)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/my-app";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  insertData();  // 👉 Start seeding after successful connection
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
});

// ✅ 2. Insert Sample Data
const insertData = async () => {
  try {
    // 🏫 Create College
    const gla = await College.create({
      name: "GLA University",
      domain: "gla.ac.in"
    });

    // 👤 Create Sample User
    const user = await User.create({
      name: "Yogendra Palhawat",
      username: "yogendra123",
      email: "yogendra@gla.ac.in",
      password: "password123", // ⚠️ NOTE: This is not hashed! Login won't work until bcrypt is applied
      role: "Student",
      college: gla._id,
      githubProfile: "https://github.com/yogendra",
      interests: ["Hackathons", "AI"],
      skills: ["Node.js", "MongoDB"]
    });

    console.log("🎉 Sample data inserted successfully");
  } catch (err) {
    console.error("❌ Insert Error:", err.message);
  } finally {
    mongoose.disconnect(() => {
      console.log("🔌 Disconnected from MongoDB");
    });
  }
};
