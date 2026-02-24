import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    mapLink: {
      type: String,
      trim: true,
    },
    supportHours: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    socials: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);

export default ContactInfo;
