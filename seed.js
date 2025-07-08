// seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./DB.SCHEMA/User.js";
import { College } from "./DB.SCHEMA/College.js";

// 🔐 Load .env file
dotenv.config();

// ✅ 1. Connect to MongoDB Atlas or fallback to local
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/my-app";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    insertData(); // Start inserting after DB connection
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// ✅ 2. Insert College + User
const insertData = async () => {
  try {
    // 💥 Clean up existing records (optional)
    await College.deleteMany();
    await User.deleteMany();

    // 🏫 Insert Sample College
    const gla = await College.create({
      name: "GLA University",
      domain: "gla.ac.in",
      location: "Mathura, India",
      verified: true,
    });

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 👤 Insert Sample User
    const user = await User.create({
      name: "Yogendra Palhawat",
      username: "yogendra123",
      email: "yogendra@gla.ac.in",
      password: hashedPassword,
      role: "Student",
      college: gla._id,
      githubProfile: "https://github.com/yogendra",
      interests: ["Hackathons", "AI"],
      skills: ["Node.js", "MongoDB"],
    });

    console.log("🎉 Sample College + User seeded successfully");
  } catch (err) {
    console.error("❌ Insert Error:", err.message);
  } finally {
    mongoose.disconnect(() => {
      console.log("🔌 Disconnected from MongoDB");
    });
  }
};
