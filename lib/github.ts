export type LanguageStat = {
  name: string;
  color: string;
  size: number;
  percentage: number;
  repositories: number;
};

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type GitHubStats = {
  login: string;
  name: string;
  accountYears: number;
  followers: number;
  repositories: number;
  stars: number;
  forks: number;
  contributions: number;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  busiestDay: number;
  monthlyContributions: number[];
  contributionDays: ContributionDay[];
  languages: LanguageStat[];
  analyzedRepositories: number;
  generatedAt: string;
};

type GraphLanguageEdge = { size: number; node: { name: string; color: string | null } };
type GraphRepository = {
  isArchived: boolean;
  stargazerCount: number;
  forkCount: number;
  languages: { edges: GraphLanguageEdge[] };
};
type GraphDay = { date: string; contributionCount: number; contributionLevel: string };
type GraphResponse = {
  data?: {
    user: null | {
      login: string;
      name: string | null;
      createdAt: string;
      followers: { totalCount: number };
      repositories: { totalCount: number; nodes: Array<GraphRepository | null> };
      contributionsCollection: {
        totalCommitContributions: number;
        totalIssueContributions: number;
        totalPullRequestContributions: number;
        totalPullRequestReviewContributions: number;
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{ contributionDays: GraphDay[] }>;
        };
      };
    };
  };
  errors?: Array<{ message: string; type?: string }>;
};

export class GitHubStatsError extends Error {
  constructor(message: string, public readonly code: "CONFIG" | "NOT_FOUND" | "RATE_LIMIT" | "UPSTREAM") {
    super(message);
  }
}

export function isGitHubUsername(value: string) {
  return /^(?!-)(?!.*--)[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(value);
}

function contributionLevel(value: string) {
  const levels: Record<string, number> = {
    NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
  };
  return levels[value] ?? 0;
}

function streaks(days: ContributionDay[]) {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0;
  let running = 0;
  for (const day of sorted) {
    running = day.count > 0 ? running + 1 : 0;
    longest = Math.max(longest, running);
  }

  let end = sorted.length - 1;
  if (end >= 0 && sorted[end].count === 0) end -= 1;
  let current = 0;
  while (end >= 0 && sorted[end].count > 0) {
    current += 1;
    end -= 1;
  }
  return { current, longest };
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new GitHubStatsError("GITHUB_TOKEN is not configured", "CONFIG");

  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 365);

  const query = `query ProfileStats($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login name createdAt followers { totalCount }
      repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: { field: PUSHED_AT, direction: DESC }) {
        totalCount
        nodes {
          isArchived stargazerCount forkCount
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name color } }
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions totalIssueContributions
        totalPullRequestContributions totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;

  let response: Response;
  try {
    response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "sarinduu-readme-widgets",
      },
      body: JSON.stringify({ query, variables: { login: username, from: from.toISOString(), to: to.toISOString() } }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new GitHubStatsError("GitHub did not respond in time", "UPSTREAM");
  }

  if (response.status === 401 || response.status === 403 || response.status === 429) {
    throw new GitHubStatsError("GitHub API rate limit or authentication error", "RATE_LIMIT");
  }
  if (!response.ok) throw new GitHubStatsError("GitHub API request failed", "UPSTREAM");

  const payload = await response.json() as GraphResponse;
  if (!payload.data?.user) {
    const notFound = payload.errors?.some((item) => /could not resolve to a user/i.test(item.message));
    throw new GitHubStatsError(notFound ? "GitHub user not found" : "GitHub returned invalid data", notFound ? "NOT_FOUND" : "UPSTREAM");
  }

  const user = payload.data.user;
  const repositories = user.repositories.nodes.filter((repo): repo is GraphRepository => Boolean(repo && !repo.isArchived));
  const languageMap = new Map<string, { color: string; size: number; repositories: number }>();
  for (const repository of repositories) {
    for (const edge of repository.languages.edges) {
      const current = languageMap.get(edge.node.name) ?? { color: edge.node.color || "#8B8175", size: 0, repositories: 0 };
      current.size += edge.size;
      current.repositories += 1;
      languageMap.set(edge.node.name, current);
    }
  }
  const totalLanguageSize = [...languageMap.values()].reduce((sum, item) => sum + item.size, 0);
  const languages = [...languageMap.entries()]
    .map(([name, item]) => ({ name, ...item, percentage: totalLanguageSize ? item.size / totalLanguageSize * 100 : 0 }))
    .sort((a, b) => b.size - a.size);

  const collection = user.contributionsCollection;
  const graphDays = collection.contributionCalendar.weeks.flatMap((week) => week.contributionDays);
  const contributionDays = graphDays.map((day) => ({
    date: day.date, count: day.contributionCount, level: contributionLevel(day.contributionLevel),
  }));
  const monthlyContributions = Array.from({ length: 12 }, () => 0);
  const firstChartMonth = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth() - 11, 1));
  for (const day of contributionDays) {
    const date = new Date(`${day.date}T00:00:00Z`);
    const monthOffset = (date.getUTCFullYear() - firstChartMonth.getUTCFullYear()) * 12
      + date.getUTCMonth() - firstChartMonth.getUTCMonth();
    if (monthOffset >= 0 && monthOffset < 12) monthlyContributions[monthOffset] += day.count;
  }
  const { current, longest } = streaks(contributionDays);
  const created = new Date(user.createdAt);
  const accountYears = Math.max(0, Math.floor((Date.now() - created.getTime()) / 31_556_952_000));

  return {
    login: user.login,
    name: user.name || user.login,
    accountYears,
    followers: user.followers.totalCount,
    repositories: user.repositories.totalCount,
    stars: repositories.reduce((sum, repo) => sum + repo.stargazerCount, 0),
    forks: repositories.reduce((sum, repo) => sum + repo.forkCount, 0),
    contributions: collection.contributionCalendar.totalContributions,
    commits: collection.totalCommitContributions,
    pullRequests: collection.totalPullRequestContributions,
    issues: collection.totalIssueContributions,
    reviews: collection.totalPullRequestReviewContributions,
    activeDays: contributionDays.filter((day) => day.count > 0).length,
    currentStreak: current,
    longestStreak: longest,
    busiestDay: Math.max(0, ...contributionDays.map((day) => day.count)),
    monthlyContributions,
    contributionDays,
    languages,
    analyzedRepositories: repositories.length,
    generatedAt: to.toISOString(),
  };
}
