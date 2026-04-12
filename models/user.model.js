import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    course: { type: String, required: true, trim: true },
    state: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    budget: { type: String, trim: true, default: "" },
    careerGoal: { type: String, trim: true, default: "" },
    preferredMode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid", ""],
      default: "",
    },
    source: { type: String, trim: true, default: "Website" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Application Started", "Converted"],
      default: "New",
    },
    notes: { type: String, trim: true, default: "" },
    savedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
    comparisonHistory: [
      {
        colleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
        comparedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
