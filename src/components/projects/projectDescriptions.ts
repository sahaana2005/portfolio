export interface GitHubProject {
  id: string;
  name: string;
  repoName: string;
  url: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  tags: string[];
}

/**
 * Editable description overrides keyed by repo name (or project name).
 * If a repo matches one of these keys, this description takes precedence.
 */
export const PROJECT_DESCRIPTIONS: Record<string, string> = {
  "Piggypie":
    "A playful, gamified micro-savings and personal budgeting application engineered to make financial discipline rewarding with dynamic milestones and coin-drop mechanics.",
  "AI-PLANT-DISEASE-DETECTION":
    "Deep learning computer vision pipeline utilizing convolutional neural networks to rapidly diagnose foliar pathogens and crop leaf diseases from real-time field photography.",
  "sofasogood-":
    "An aesthetic interior living and minimalist furniture commerce platform focused on tactile typography, spatial previews, and frictionless modern checkout experiences.",
  "SQLiSquidScanner":
    "Multi-threaded security penetration auditing scanner that autonomously spiders web endpoints to execute recursive payload injection and heuristic SQL injection analysis.",
  "ssh-honeypot-monitor":
    "Low-interaction SSH trap decoy capturing brute-force intrusion telemetry, malicious payloads, and unauthorized shell interactions with real-time threat monitoring.",
  "spline-portfolio-app":
    "Cinematic personal portfolio with Spline 3D room, eye-zoom transitions, and KDE Plasma Linux desktop showcase.",
  "AI-Resume-Screener":
    "NLP-powered resume screening tool that ranks candidates against job descriptions using TF-IDF and semantic similarity.",
  "gesture-canvas":
    "Real-time hand-gesture drawing canvas using MediaPipe hand tracking and OpenCV. Draw in the air with no touch required.",
  "SmartBite":
    "Nutrition-tracking web app that uses food image recognition to estimate macro content with custom CNN models.",
  "mini-shell":
    "A tiny UNIX shell in C supporting piping, I/O redirection, background processes, and built-in commands.",
  "EchoBoard":
    "Collaborative real-time whiteboard with voice annotation built on WebSockets and WebRTC.",
};

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  C: "#555555",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
};

/**
 * Repositories explicitly excluded from appearing as desktop folders
 */
export const EXCLUDED_REPO_PATTERNS = [
  "darkweb",
  "impostor",
  "imposter",
  "sqlisquid",
  "sqliscan",
  "sahaana2005",
  "emotiscreen",
  "privacy-voice",
  "privacyvoice",
];

export function isRepoExcluded(name: string): boolean {
  const lower = name.toLowerCase().replace(/[\s_-]/g, "");
  return EXCLUDED_REPO_PATTERNS.some((pattern) => {
    const cleanPattern = pattern.toLowerCase().replace(/[\s_-]/g, "");
    return lower.includes(cleanPattern);
  });
}

/**
 * Default projects list matching Sahaana's pinned work & specific showcases.
 */
export const FALLBACK_PROJECTS: GitHubProject[] = [
  {
    id: "piggypie",
    name: "Piggypie",
    repoName: "sahaana2005/Piggypie",
    url: "https://github.com/sahaana2005/Piggypie",
    description: PROJECT_DESCRIPTIONS["Piggypie"],
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 3,
    forks: 1,
    tags: ["Finance", "Gamification", "React", "TypeScript"],
  },
  {
    id: "plant-ai",
    name: "AI-PLANT-DISEASE-DETECTION",
    repoName: "sahaana2005/AI-PLANT-DISEASE-DETECTION",
    url: "https://github.com/sahaana2005/AI-PLANT-DISEASE-DETECTION",
    description: PROJECT_DESCRIPTIONS["AI-PLANT-DISEASE-DETECTION"],
    language: "Python",
    languageColor: "#3572A5",
    stars: 5,
    forks: 2,
    tags: ["Computer Vision", "PyTorch", "CNN", "FastAPI"],
  },
  {
    id: "sofasogood",
    name: "sofasogood-",
    repoName: "sahaana2005/sofasogood-",
    url: "https://github.com/sahaana2005/sofasogood-",
    description: PROJECT_DESCRIPTIONS["sofasogood-"],
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 2,
    forks: 0,
    tags: ["E-Commerce", "UX Design", "Full-Stack", "TailwindCSS"],
  },
  {
    id: "honeypot",
    name: "ssh-honeypot-monitor",
    repoName: "sahaana2005/ssh-honeypot-monitor",
    url: "https://github.com/sahaana2005/ssh-honeypot-monitor",
    description: PROJECT_DESCRIPTIONS["ssh-honeypot-monitor"],
    language: "Python",
    languageColor: "#3572A5",
    stars: 6,
    forks: 2,
    tags: ["Network Security", "SSH Decoy", "Telemetry"],
  },
  {
    id: "spline-portfolio",
    name: "PORTFOLIO",
    repoName: "sahaana2005/PORTFOLIO",
    url: "https://github.com/sahaana2005/PORTFOLIO",
    description: PROJECT_DESCRIPTIONS["spline-portfolio-app"],
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 4,
    forks: 1,
    tags: ["3D", "Spline", "React", "KDE Desktop"],
  },
];

interface RawGitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  fork: boolean;
}

/**
 * Fetches public repositories for user `sahaana2005` from GitHub.
 * Seamlessly merges with description overrides and falls back to static projects.
 */
export async function fetchGitHubProjects(username = "sahaana2005"): Promise<GitHubProject[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=12`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      return FALLBACK_PROJECTS;
    }

    const repos: RawGitHubRepo[] = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      return FALLBACK_PROJECTS;
    }

    const validRepos = repos.filter(
      (r) => !r.fork && !isRepoExcluded(r.name)
    );
    const activeList = validRepos.length >= 3 ? validRepos : repos.filter((r) => !isRepoExcluded(r.name));

    const mapped: GitHubProject[] = activeList.slice(0, 8).map((repo) => {
      const overrideDesc = PROJECT_DESCRIPTIONS[repo.name];
      const lang = repo.language ?? "TypeScript";
      const langColor = LANGUAGE_COLORS[lang] ?? "#ff4fa3";

      return {
        id: repo.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: repo.name,
        repoName: `${username}/${repo.name}`,
        url: repo.html_url,
        description:
          overrideDesc ||
          repo.description ||
          "Full-stack software engineering project with interactive architecture and modern standards.",
        language: lang,
        languageColor: langColor,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        tags: repo.topics && repo.topics.length > 0 ? repo.topics.slice(0, 4) : [lang, "GitHub"],
      };
    });

    // Ensure our signature projects are always discoverable (and non-excluded)
    const names = new Set(mapped.map((p) => p.name.toLowerCase()));
    for (const fb of FALLBACK_PROJECTS) {
      if (!isRepoExcluded(fb.name) && !names.has(fb.name.toLowerCase())) {
        mapped.push(fb);
      }
    }

    return mapped.filter((p) => !isRepoExcluded(p.name));
  } catch {
    return FALLBACK_PROJECTS;
  }
}
