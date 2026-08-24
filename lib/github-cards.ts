import type { GitHubStats } from "./github";

export type GitHubCard = "overview" | "languages" | "activity" | "combined";

const palette = {
  forest: "#345D57",
  copper: "#B98245",
  gold: "#D2A162",
};

function escapeXml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&apos;",
        '"': "&quot;",
      })[character] || character,
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function shell(width: number, height: number, label: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}">
  <style>
    .bg{fill:#F7F1E8}.panel{fill:#FCFAF6}.border{stroke:#DDD2C3}.ink{fill:#2C2925}.muted{fill:#8B8175}.grid{fill:#E9E0D5}
    text{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
    @media(prefers-color-scheme:dark){.bg{fill:#151411}.panel{fill:#1C1A17}.border{stroke:#3D3933}.ink{fill:#F8F6F1}.muted{fill:#A79E92}.grid{fill:#302D28}}
  </style>
  <rect class="bg" width="${width}" height="${height}" rx="12"/>
  <rect class="panel border" x="1" y="1" width="${width - 2}" height="${height - 2}" rx="11" stroke-width="2"/>
  ${body}
</svg>`;
}

function header(width: number, login: string, section: string) {
  return `<text class="muted" x="24" y="26" font-size="11">github://${escapeXml(login)}/${section}</text>
  <path class="border" d="M1 42H${width - 1}"/>`;
}

export function renderOverview(stats: GitHubStats) {
  const metrics = [
    ["CONTRIBUTIONS", stats.contributions],
    ["STARS", stats.stars],
    ["REPOSITORIES", stats.repositories],
    ["FOLLOWERS", stats.followers],
    ["ACCOUNT YEARS", stats.accountYears],
  ] as const;
  const bars = stats.monthlyContributions;
  const maximum = Math.max(1, ...bars);
  const body = `${header(900, stats.login, "overview")}
  <text class="ink" x="28" y="76" font-size="18" font-weight="700">${escapeXml(stats.name)}</text>
  <text class="muted" x="28" y="95" font-size="11">@${escapeXml(stats.login)} · public GitHub activity</text>
  ${metrics
    .map(([label, value], index) => {
      const x = 28 + index * 170;
      return `<text class="ink" x="${x}" y="145" font-size="22" font-weight="700">${formatNumber(value)}</text><text class="muted" x="${x}" y="163" font-size="9" letter-spacing="1">${label}</text>`;
    })
    .join("")}
  <text class="muted" x="28" y="199" font-size="9">12-MONTH ACTIVITY</text>
  ${bars
    .map((value, index) => {
      const height = Math.max(4, Math.round((value / maximum) * 56));
      return `<rect x="${148 + index * 59}" y="${248 - height}" width="45" height="${height}" rx="2" fill="${index % 3 === 0 ? palette.copper : palette.forest}" opacity="${value ? 0.9 : 0.22}"/>`;
    })
    .join("")}`;
  return shell(900, 260, `${stats.login} GitHub overview`, body);
}

export function renderLanguages(stats: GitHubStats) {
  const shown = stats.languages.slice(0, 5);
  const body = `${header(442, stats.login, "languages")}
  <text class="ink" x="24" y="75" font-size="18" font-weight="700">Languages</text>
  <text class="muted" x="24" y="93" font-size="10">BY CODE SIZE · PUBLIC NON-FORK REPOSITORIES</text>
  ${
    shown.length
      ? shown
          .map((language, index) => {
            const y = 126 + index * 36;
            const width = Math.max(
              2,
              Math.round((language.percentage / 100) * 270),
            );
            return `<circle cx="28" cy="${y - 4}" r="4" fill="${escapeXml(language.color)}"/>
      <text class="ink" x="40" y="${y}" font-size="11">${escapeXml(language.name)}</text>
      <text class="muted" x="414" y="${y}" font-size="10" text-anchor="end">${language.percentage.toFixed(1)}%</text>
      <rect class="grid" x="40" y="${y + 8}" width="374" height="5" rx="2.5"/>
      <rect x="40" y="${y + 8}" width="${(width * 374) / 270}" height="5" rx="2.5" fill="${escapeXml(language.color)}"/>`;
          })
          .join("")
      : `<text class="muted" x="24" y="145" font-size="12">No language data found.</text>`
  }
  <path class="border" d="M24 292H418"/>
  <text class="muted" x="24" y="309" font-size="9">${stats.analyzedRepositories} REPOSITORIES ANALYZED</text>`;
  return shell(442, 320, `${stats.login} top GitHub languages`, body);
}

export function renderActivity(stats: GitHubStats) {
  const breakdown = [
    ["COMMITS", stats.commits, palette.forest],
    ["PULL REQUESTS", stats.pullRequests, palette.copper],
    ["ISSUES", stats.issues, palette.gold],
    ["REVIEWS", stats.reviews, "#7FA49B"],
  ] as const;
  const maximum = Math.max(1, ...breakdown.map(([, value]) => value));
  const metrics = [
    ["TOTAL", stats.contributions],
    ["ACTIVE DAYS", stats.activeDays],
    ["CURRENT", `${stats.currentStreak}d`],
    ["LONGEST STREAK", `${stats.longestStreak}d`],
  ];
  const body = `${header(442, stats.login, "activity")}
  <text class="ink" x="24" y="75" font-size="18" font-weight="700">Contribution activity</text>
  <text class="muted" x="24" y="93" font-size="10">CONTRIBUTION BREAKDOWN · LAST 365 DAYS</text>
  ${breakdown
    .map(([label, value, color], index) => {
      const y = 119 + index * 29;
      const width = Math.max(2, Math.round((value / maximum) * 238));
      return `<text class="muted" x="24" y="${y}" font-size="9">${label}</text><rect class="grid" x="142" y="${y - 9}" width="238" height="9" rx="4.5"/><rect x="142" y="${y - 9}" width="${width}" height="9" rx="4.5" fill="${color}"/><text class="ink" x="414" y="${y}" font-size="10" text-anchor="end">${formatNumber(value)}</text>`;
    })
    .join("")}
  <path class="border" d="M24 236H418"/>
  ${metrics
    .map(([label, value], index) => {
      const x = 24 + index * 102;
      const y = 276;
      return `<text class="ink" x="${x}" y="${y}" font-size="20" font-weight="700">${typeof value === "number" ? formatNumber(value) : value}</text><text class="muted" x="${x}" y="${y + 17}" font-size="8" letter-spacing="0.7">${label}</text>`;
    })
    .join("")}`;
  return shell(442, 320, `${stats.login} GitHub contribution activity`, body);
}

function positionCard(svg: string, x: number, y: number) {
  return svg.replace("<svg ", `<svg x="${x}" y="${y}" `);
}

export function renderCombined(stats: GitHubStats) {
  const overview = positionCard(renderOverview(stats), 0, 0);
  const languages = positionCard(renderLanguages(stats), 0, 276);
  const activity = positionCard(renderActivity(stats), 458, 276);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="596" viewBox="0 0 900 596" role="img" aria-label="${escapeXml(stats.login)} complete GitHub statistics">
  ${overview}
  ${languages}
  ${activity}
</svg>`;
}

export function renderGitHubError(
  card: GitHubCard,
  username: string,
  message: string,
) {
  const [width, height] = card === "combined"
    ? [900, 596]
    : card === "overview"
      ? [900, 260]
      : [442, 320];
  const body = `${header(width, username || "user", card)}
  <text class="ink" x="24" y="88" font-size="17" font-weight="700">GitHub data unavailable</text>
  <text class="muted" x="24" y="112" font-size="11">${escapeXml(message)}</text>
  <text x="24" y="${height - 24}" font-size="10" fill="${palette.copper}">Try again shortly.</text>`;
  return shell(width, height, "GitHub statistics unavailable", body);
}
