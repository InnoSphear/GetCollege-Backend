import mongoose from "mongoose";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, trim: true },
    fee: { type: String, required: true, trim: true },
    placement: { type: String, required: true, trim: true },
    duration: { type: String, trim: true },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid", ""],
      default: "",
    },
    specialization: { type: String, trim: true },
    eligibility: { type: String, trim: true },
  },
  { _id: false }
);

const metricSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    value: { type: String, trim: true },
  },
  { _id: false }
);

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, index: true },
    website: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    logo: { type: String, required: true, trim: true },
    bannerImage: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    location: { type: String, trim: true },
    approvals: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    image: [{ type: String, trim: true }],
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    aboutHeading: { type: String, trim: true },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid", ""],
      default: "",
    },
    specialization: [{ type: String, trim: true }],
    ranking: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    averagePlacement: { type: String, required: true, trim: true },
    placementRate: { type: Number, default: 0 },
    highestPackage: { type: String, trim: true },
    averagePackage: { type: String, trim: true },
    roiScore: { type: Number, default: 0 },
    feesRange: { type: String, trim: true },
    medianFees: { type: Number, default: 0 },
    establishedYear: { type: Number, default: 0 },
    studentsEnrolled: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    featuredRank: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    scholarshipAvailable: { type: Boolean, default: false },
    facilities: [{ type: String, trim: true }],
    pros: [{ type: String, trim: true }],
    cons: [{ type: String, trim: true }],
    highlights: [{ type: String, trim: true }],
    metrics: [metricSchema],
    course: [courseSchema],
    reviews: [
      new mongoose.Schema(
        {
          name: { type: String, trim: true },
          course: { type: String, trim: true },
          rating: { type: Number, default: 0 },
          comment: { type: String, trim: true },
        },
        { _id: false }
      ),
    ],
    seo: new mongoose.Schema(
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        keywords: [{ type: String, trim: true }],
      },
      { _id: false }
    ),
  },
  { timestamps: true }
);

collegeSchema.pre("validate", function setDerivedFields(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }

  if (!this.location) {
    this.location = [this.city, this.state].filter(Boolean).join(", ");
  }

  if (!this.bannerImage && this.image?.length) {
    this.bannerImage = this.image[0];
  }

  if (!this.shortDescription && this.description) {
    const plainText = this.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    this.shortDescription = plainText.slice(0, 180);
  }

  if (!this.feesRange && this.course?.length) {
    const amounts = this.course
      .map((item) => Number(String(item.fee || "").replace(/[^\d.]/g, "")))
      .filter(Boolean);
    if (amounts.length) {
      const min = Math.min(...amounts);
      const max = Math.max(...amounts);
      this.medianFees = this.medianFees || Math.round((min + max) / 2);
      this.feesRange = `INR ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
  }

  next();
});

const College = mongoose.model("College", collegeSchema);

export default College;
