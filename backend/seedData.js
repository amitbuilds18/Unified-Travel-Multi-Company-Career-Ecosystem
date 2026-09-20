import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Company from "./models/Company.js";
import Job from "./models/Job.js";

dotenv.config();

const connectWithFallback = async () => {
  const primaryUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelDB";
  const localFallbackUri = "mongodb://127.0.0.1:27017/travelDB";

  try {
    await mongoose.connect(primaryUri, { family: 4, serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB via primary URI");
  } catch (err) {
    console.log("Primary URI failed, falling back to local MongoDB...");
    await mongoose.connect(localFallbackUri, { family: 4, serverSelectionTimeoutMS: 3000 });
    console.log("Connected to local MongoDB successfully");
  }
};

const seed = async () => {
  try {
    await connectWithFallback();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Recruiter 1
    let recruiter1 = await User.findOne({ email: "recruiter.tech@company.com" });
    if (!recruiter1) {
      recruiter1 = await User.create({
        name: "Sarah Jenkins",
        email: "recruiter.tech@company.com",
        password: hashedPassword,
        role: "company_admin",
        phone: "+91 9876543210",
        headline: "Lead Tech Recruiter at CloudScale Systems",
      });
    }

    // 2. Recruiter 2
    let recruiter2 = await User.findOne({ email: "recruiter.travel@voyage.com" });
    if (!recruiter2) {
      recruiter2 = await User.create({
        name: "David Chen",
        email: "recruiter.travel@voyage.com",
        password: hashedPassword,
        role: "company_admin",
        phone: "+91 9876543211",
        headline: "Talent Acquisition Lead at Voyage Horizon",
      });
    }

    // 3. Candidate Demo User
    let candidate = await User.findOne({ email: "candidate@demo.com" });
    if (!candidate) {
      candidate = await User.create({
        name: "Arvind Kumar",
        email: "candidate@demo.com",
        password: hashedPassword,
        role: "user",
        phone: "+91 9123456780",
        headline: "Full-Stack Developer | React & Node.js Enthusiast",
        bio: "Passionate software engineer with 2+ years of experience crafting high-performance, accessible web applications.",
        skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "TypeScript", "REST APIs"],
        resumeUrl: "https://example.com/resumes/arvind-kumar.pdf",
        experienceYears: 2,
        location: "Bengaluru, India",
        portfolioUrl: "https://github.com/arvind",
      });
    }

    // 4. SuperAdmin Demo User
    let admin = await User.findOne({ email: "admin@platform.com" });
    if (!admin) {
      admin = await User.create({
        name: "System SuperAdmin",
        email: "admin@platform.com",
        password: hashedPassword,
        role: "superadmin",
        phone: "+91 9999999999",
        headline: "Chief Platform Administrator & Moderator",
      });
      console.log("SuperAdmin account seeded: admin@platform.com / password123");
    }

    // 4. Demo Companies
    const demoCompanies = [
      {
        name: "CloudScale Systems",
        tagline: "Next-generation cloud infrastructure & microservices",
        description: "CloudScale Systems is a high-growth cloud intelligence platform powering over 50,000 enterprise applications worldwide.",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        website: "https://cloudscale.example.com",
        email: "careers@cloudscale.example.com",
        location: "Bengaluru, India & Remote",
        industry: "Cloud & Infrastructure",
        employeeCount: "250-500 employees",
        foundedYear: 2019,
        verified: true,
        owner: recruiter1._id,
      },
      {
        name: "Voyage Horizon Media",
        tagline: "Global travel intelligence & experiential booking platforms",
        description: "Voyage Horizon builds immersive travel booking engines, hotel ERP systems, and curated travel experiences across 45 countries.",
        logo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80",
        website: "https://voyagehorizon.example.com",
        email: "jobs@voyagehorizon.example.com",
        location: "Mumbai, India & Hybrid",
        industry: "Travel & Hospitality Tech",
        employeeCount: "100-250 employees",
        foundedYear: 2021,
        verified: true,
        owner: recruiter2._id,
      },
      {
        name: "Apex FinTech Labs",
        tagline: "Autonomous financial payment gateways & digital banking",
        description: "Apex FinTech provides secure, real-time transaction processing and cross-border currency payment rails for modern enterprises.",
        logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80",
        website: "https://apexfintech.example.com",
        email: "talent@apexfintech.example.com",
        location: "Hyderabad, India & Remote",
        industry: "Financial Technology",
        employeeCount: "50-100 employees",
        foundedYear: 2022,
        verified: true,
        owner: recruiter1._id,
      },
      {
        name: "Nova Health AI",
        tagline: "Empowering clinical workflows with diagnostic machine learning",
        description: "Nova Health AI simplifies healthcare diagnostics with real-time patient intelligence and predictive algorithms.",
        logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
        website: "https://novahealth.example.com",
        email: "hiring@novahealth.example.com",
        location: "Delhi NCR, India",
        industry: "Healthcare & AI",
        employeeCount: "20-50 employees",
        foundedYear: 2023,
        verified: true,
        owner: recruiter2._id,
      },
    ];

    const savedCompanies = [];
    for (const cData of demoCompanies) {
      let comp = await Company.findOne({ name: cData.name });
      if (!comp) {
        comp = await Company.create(cData);
        console.log(`Created company: ${comp.name}`);
      }
      savedCompanies.push(comp);
    }

    // 5. Demo Jobs
    const demoJobs = [
      {
        title: "Senior Full-Stack Engineer (MERN)",
        company: savedCompanies[0]._id,
        location: "Bengaluru, India / Remote",
        jobType: "Full-time",
        experienceLevel: "Senior Level",
        category: "Software Development",
        salaryMin: 1800000,
        salaryMax: 2800000,
        salaryCurrency: "INR",
        description: "Join our core architecture team to build scalable microservices, real-time dashboards, and high-performance React frontends.",
        requirements: ["3+ years with Node.js, Express, and MongoDB", "Proficient in React 18/19 and modern CSS frameworks", "Experience with cloud deployments (AWS/Docker)"],
        skillsRequired: ["React", "Node.js", "MongoDB", "Express", "REST APIs", "Docker"],
        openings: 3,
        postedBy: recruiter1._id,
      },
      {
        title: "Frontend React Developer",
        company: savedCompanies[1]._id,
        location: "Mumbai, India / Hybrid",
        jobType: "Full-time",
        experienceLevel: "Mid Level",
        category: "Frontend Development",
        salaryMin: 900000,
        salaryMax: 1500000,
        salaryCurrency: "INR",
        description: "We are seeking a talented UI/UX-focused frontend developer to design and optimize high-converting booking workflows and interactive trip planners.",
        requirements: ["2+ years working with React and Tailwind CSS", "Strong understanding of responsive layouts and state management", "Experience integrating payment gateways (Razorpay, Stripe)"],
        skillsRequired: ["React", "Tailwind CSS", "JavaScript", "HTML/CSS", "Git"],
        openings: 2,
        postedBy: recruiter2._id,
      },
      {
        title: "Backend Node.js Engineer",
        company: savedCompanies[2]._id,
        location: "Remote",
        jobType: "Full-time",
        experienceLevel: "Mid Level",
        category: "Backend Development",
        salaryMin: 1200000,
        salaryMax: 2000000,
        salaryCurrency: "INR",
        description: "Build robust financial processing APIs, implement webhooks, and ensure bank-grade security across transactional databases.",
        requirements: ["Strong hands-on experience with Node.js and MongoDB/PostgreSQL", "Understanding of cryptographic security, JWT, and rate limiting", "Experience handling concurrent financial transactions"],
        skillsRequired: ["Node.js", "Express", "MongoDB", "JWT", "Security", "Microservices"],
        openings: 2,
        postedBy: recruiter1._id,
      },
      {
        title: "Product Design & UX Intern",
        company: savedCompanies[3]._id,
        location: "Delhi NCR, India / Hybrid",
        jobType: "Internship",
        experienceLevel: "Fresher",
        category: "Design",
        salaryMin: 25000,
        salaryMax: 40000,
        salaryCurrency: "INR",
        description: "Work closely with our product designers and clinical doctors to design simple, elegant clinical interfaces and user flows.",
        requirements: ["Proficient with Figma and prototyping tools", "Good visual design skills and typography sense", "Enthusiasm to learn user testing methodologies"],
        skillsRequired: ["Figma", "UI/UX", "Prototyping", "Wireframing"],
        openings: 2,
        postedBy: recruiter2._id,
      },
    ];

    for (const jData of demoJobs) {
      const exists = await Job.findOne({ title: jData.title, company: jData.company });
      if (!exists) {
        await Job.create(jData);
        console.log(`Created job: ${jData.title}`);
      }
    }

    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
