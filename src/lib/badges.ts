// Badge and XP system configuration

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: "xp" | "projects" | "tasks" | "resources" | "endorsements" | "posts";
}

export const BADGES: Badge[] = [
  // XP-based badges
  {
    id: "newcomer",
    name: "Newcomer",
    description: "Earned your first 100 XP",
    icon: "🌱",
    requirement: 100,
    type: "xp"
  },
  {
    id: "rising_star",
    name: "Rising Star",
    description: "Reached 500 XP",
    icon: "⭐",
    requirement: 500,
    type: "xp"
  },
  {
    id: "experienced",
    name: "Experienced",
    description: "Reached 1000 XP",
    icon: "💫",
    requirement: 1000,
    type: "xp"
  },
  {
    id: "expert",
    name: "Expert",
    description: "Reached 2500 XP",
    icon: "🏆",
    requirement: 2500,
    type: "xp"
  },
  {
    id: "master",
    name: "Master",
    description: "Reached 5000 XP",
    icon: "👑",
    requirement: 5000,
    type: "xp"
  },

  // Project-based badges
  {
    id: "project_starter",
    name: "Project Starter",
    description: "Created your first project",
    icon: "🚀",
    requirement: 1,
    type: "projects"
  },
  {
    id: "project_creator",
    name: "Project Creator",
    description: "Created 5 projects",
    icon: "🎯",
    requirement: 5,
    type: "projects"
  },

  // Task-based badges
  {
    id: "task_completer",
    name: "Task Completer",
    description: "Completed 10 tasks",
    icon: "✅",
    requirement: 10,
    type: "tasks"
  },
  {
    id: "productivity_pro",
    name: "Productivity Pro",
    description: "Completed 50 tasks",
    icon: "⚡",
    requirement: 50,
    type: "tasks"
  },

  // Resource-based badges
  {
    id: "resource_sharer",
    name: "Resource Sharer",
    description: "Shared 5 resources",
    icon: "📚",
    requirement: 5,
    type: "resources"
  },
  {
    id: "knowledge_curator",
    name: "Knowledge Curator",
    description: "Shared 20 resources",
    icon: "📖",
    requirement: 20,
    type: "resources"
  },

  // Endorsement-based badges
  {
    id: "endorsed",
    name: "Endorsed",
    description: "Received 5 endorsements",
    icon: "🌟",
    requirement: 5,
    type: "endorsements"
  },
  {
    id: "trusted_expert",
    name: "Trusted Expert",
    description: "Received 20 endorsements",
    icon: "💎",
    requirement: 20,
    type: "endorsements"
  },

  // Post-based badges
  {
    id: "collaborator",
    name: "Collaborator",
    description: "Created 5 collaboration posts",
    icon: "🤝",
    requirement: 5,
    type: "posts"
  }
];

export const XP_REWARDS = {
  TASK_COMPLETE: 20,
  PROJECT_CREATE: 50,
  PROJECT_COMPLETE: 100,
  RESOURCE_SHARE: 15,
  RESOURCE_UPVOTE: 5,
  POST_CREATE: 25,
  ENDORSEMENT_RECEIVED: 30,
  JOIN_PROJECT: 10,
  TASK_CREATE: 5
};

export function checkNewBadges(
  currentBadges: string[],
  userStats: {
    xp: number;
    projectsCreated: number;
    tasksCompleted: number;
    resourcesShared: number;
    endorsementsReceived: number;
    postsCreated: number;
  }
): Badge[] {
  const earnedBadges: Badge[] = [];

  for (const badge of BADGES) {
    // Skip if already earned
    if (currentBadges.includes(badge.id)) continue;

    let earned = false;

    switch (badge.type) {
      case "xp":
        earned = userStats.xp >= badge.requirement;
        break;
      case "projects":
        earned = userStats.projectsCreated >= badge.requirement;
        break;
      case "tasks":
        earned = userStats.tasksCompleted >= badge.requirement;
        break;
      case "resources":
        earned = userStats.resourcesShared >= badge.requirement;
        break;
      case "endorsements":
        earned = userStats.endorsementsReceived >= badge.requirement;
        break;
      case "posts":
        earned = userStats.postsCreated >= badge.requirement;
        break;
    }

    if (earned) {
      earnedBadges.push(badge);
    }
  }

  return earnedBadges;
}

export function getBadgeById(badgeId: string): Badge | undefined {
  return BADGES.find(b => b.id === badgeId);
}