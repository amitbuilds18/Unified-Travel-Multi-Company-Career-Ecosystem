import mongoose from "mongoose";
import slugify from "slugify";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    tagline: { type: String, default: "" },
    description: { type: String, required: true },
    logo: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    website: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    industry: { type: String, default: "Technology" },
    employeeCount: { type: String, default: "11-50 employees" },
    foundedYear: { type: Number, default: 2020 },
    verified: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug before save
companySchema.pre("save", async function (next) {
  if (!this.slug) {
    let baseSlug = slugify(this.name, { lower: true, strict: true }) || "company";
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Company.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

export default mongoose.model("Company", companySchema);
