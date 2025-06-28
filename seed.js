// seed.js
import mongoose from "mongoose";
import { User } from "./DB.SCHEMA/User.js";
import { College } from "./DB.SCHEMA/College.js";

// 1. Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/my-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB Connected");
  insertData();  // start inserting once connected
}).catch(err => {
  console.error("❌ Connection Error:", err);
});

// 2. Insert Sample Data
const insertData = async () => {
  try {
    const gla = await College.create({ name: "GLA University", domain: "gla.ac.in" });

    const user = await User.create({
      name: "Yogendra Palhawat",
      username: "yogendra123",
      email: "yogendra@gla.ac.in",
      password: "password123",
      role: "Student",
      college: gla._id,
      githubProfile: "https://github.com/yogendra",
      interests: ["Hackathons", "AI"],
      skills: ["Node.js", "MongoDB"]
    });

    console.log("🎉 Data Inserted Successfully");
  } catch (err) {
    console.error("❌ Insert Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
};
