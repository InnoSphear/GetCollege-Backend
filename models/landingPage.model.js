import mongoose from "mongoose";

const landingPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    bannerSubtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    formTitle: {
      type: String,
      default: "Get Admission Details",
    },
    formFields: {
      type: String,
      default: "name,email,phone,course",
    },
    ctaButton1Text: {
      type: String,
      trim: true,
    },
    ctaButton1Link: {
      type: String,
      trim: true,
    },
    ctaButton2Text: {
      type: String,
      trim: true,
    },
    ctaButton2Link: {
      type: String,
      trim: true,
    },
    ctaButton3Text: {
      type: String,
      trim: true,
    },
    ctaButton3Link: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const LandingPage = mongoose.model("LandingPage", landingPageSchema);

export default LandingPage;