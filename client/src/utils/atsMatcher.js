/**
 * ATS (Applicant Tracking System) Smart Skill Matcher
 * Compares candidate profile skills against job requirements, normalizing variations
 * and calculating match percentages, matched skills, and skill gaps.
 */

// Skill aliases map for intelligent normalization
const SKILL_ALIASES = {
  "react.js": "react",
  "reactjs": "react",
  "react": "react",
  "node.js": "nodejs",
  "nodejs": "nodejs",
  "node": "nodejs",
  "express.js": "express",
  "expressjs": "express",
  "express": "express",
  "mongodb": "mongodb",
  "mongo": "mongodb",
  "typescript": "typescript",
  "ts": "typescript",
  "javascript": "javascript",
  "js": "javascript",
  "tailwind": "tailwindcss",
  "tailwind css": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "rest api": "rest-apis",
  "rest apis": "rest-apis",
  "rest": "rest-apis",
  "restful api": "rest-apis",
  "docker": "docker",
  "kubernetes": "kubernetes",
  "k8s": "kubernetes",
  "aws": "aws",
  "amazon web services": "aws",
  "git": "git",
  "github": "git",
  "python": "python",
  "py": "python",
  "next.js": "nextjs",
  "nextjs": "nextjs",
  "html": "html/css",
  "html5": "html/css",
  "css": "html/css",
  "css3": "html/css",
  "html/css": "html/css",
  "jwt": "jwt",
  "microservices": "microservices",
  "figma": "figma",
  "graphql": "graphql",
  "redux": "redux",
};

export const normalizeSkill = (skill) => {
  if (!skill) return "";
  const cleaned = skill.toString().trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
};

/**
 * Calculates ATS match score between a candidate's skills and a job's requirements
 * @param {Array<string>|string} candidateSkills - Candidate's skill list
 * @param {Object} job - The job opening object
 * @returns {Object} score, level, matchedSkills, missingSkills
 */
export const calculateATSScore = (candidateSkills, job) => {
  if (!job) return { score: 0, level: "LOW", matchedSkills: [], missingSkills: [] };

  // Parse candidate skills
  let userSkillsList = [];
  if (Array.isArray(candidateSkills)) {
    userSkillsList = candidateSkills;
  } else if (typeof candidateSkills === "string") {
    userSkillsList = candidateSkills.split(",").map((s) => s.trim());
  }

  const normalizedUserSkills = new Set(
    userSkillsList.map(normalizeSkill).filter(Boolean)
  );

  // Extract job skills
  let jobSkills = [];
  if (Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0) {
    jobSkills = job.skillsRequired;
  } else if (typeof job.skillsRequired === "string") {
    jobSkills = job.skillsRequired.split(",").map((s) => s.trim());
  } else if (Array.isArray(job.requirements)) {
    jobSkills = job.requirements;
  }

  // If job has no explicit skills list, return a baseline
  if (jobSkills.length === 0) {
    return {
      score: 75,
      level: "GOOD",
      matchedSkills: userSkillsList.slice(0, 3),
      missingSkills: [],
      label: "General Skill Fit",
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  jobSkills.forEach((skill) => {
    const norm = normalizeSkill(skill);
    if (normalizedUserSkills.has(norm)) {
      matchedSkills.push(skill);
    } else {
      // Also check if any candidate skill is contained in the requirement text
      const isSubMatch = Array.from(normalizedUserSkills).some((cSkill) =>
        skill.toLowerCase().includes(cSkill) || cSkill.includes(norm)
      );
      if (isSubMatch) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }
  });

  const totalRequired = jobSkills.length;
  const matchCount = matchedSkills.length;
  const score = Math.round((matchCount / Math.max(1, totalRequired)) * 100);

  let level = "LOW";
  let label = "Skill Gap";
  let badgeColor = "text-gray-600 bg-gray-100 border-gray-200";
  let ringColor = "stroke-gray-400";

  if (score >= 80) {
    level = "EXCELLENT";
    label = "High Match";
    badgeColor = "text-emerald-800 bg-emerald-50 border-emerald-200";
    ringColor = "stroke-emerald-600";
  } else if (score >= 50) {
    level = "GOOD";
    label = "Good Fit";
    badgeColor = "text-blue-800 bg-blue-50 border-blue-200";
    ringColor = "stroke-blue-600";
  } else if (score >= 30) {
    level = "MODERATE";
    label = "Moderate";
    badgeColor = "text-amber-800 bg-amber-50 border-amber-200";
    ringColor = "stroke-amber-600";
  }

  return {
    score,
    level,
    label,
    badgeColor,
    ringColor,
    matchedSkills,
    missingSkills,
    totalRequired,
    matchCount,
  };
};

/**
 * Calculates aggregate ATS statistics across a batch of selected jobs
 */
export const calculateBatchATS = (candidateSkills, jobs = []) => {
  if (!jobs || jobs.length === 0) return { avgScore: 0, topMatches: [] };

  const scores = jobs.map((j) => calculateATSScore(candidateSkills, j));
  const avgScore = Math.round(
    scores.reduce((sum, s) => sum + s.score, 0) / Math.max(1, jobs.length)
  );

  // Frequency of matched skills
  const matchFreq = {};
  scores.forEach((s) => {
    s.matchedSkills.forEach((m) => {
      matchFreq[m] = (matchFreq[m] || 0) + 1;
    });
  });

  const topMatches = Object.entries(matchFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill);

  return {
    avgScore,
    topMatches,
  };
};
