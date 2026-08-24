import { fetchGitHubStats, GitHubStatsError, isGitHubUsername } from "@/lib/github";
import {
  renderActivity,
  renderCombined,
  renderGitHubError,
  renderLanguages,
  renderOverview,
  type GitHubCard,
} from "@/lib/github-cards";

const cards = new Set<GitHubCard>(["overview", "languages", "activity", "combined"]);

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

function svgResponse(svg: string, cache: string, errorCode?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": cache,
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    "Content-Disposition": "inline",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "X-Content-Type-Options": "nosniff",
  };
  if (errorCode) headers["X-Widget-Error"] = errorCode;
  return new Response(svg, { headers });
}

export async function GET(request: Request, context: { params: Promise<{ card: string }> }) {
  const { card: rawCard } = await context.params;
  if (!cards.has(rawCard as GitHubCard)) return jsonError("Unknown GitHub card", 404);
  const card = rawCard as GitHubCard;
  const url = new URL(request.url);
  if (url.search.length > 256) return jsonError("Query string is too long", 414);

  const entries = [...url.searchParams.entries()];
  if (entries.some(([key]) => key !== "username")) return jsonError("Only the username parameter is supported", 400);
  if (entries.filter(([key]) => key === "username").length > 1) return jsonError("Duplicate username parameter", 400);

  const username = url.searchParams.get("username")?.trim() || "";
  if (!username) return jsonError("The username parameter is required", 400);
  if (!isGitHubUsername(username)) return jsonError("Invalid GitHub username", 400);

  try {
    const stats = await fetchGitHubStats(username);
    const renderers = {
      overview: renderOverview,
      languages: renderLanguages,
      activity: renderActivity,
      combined: renderCombined,
    };
    return svgResponse(
      renderers[card](stats),
      "public, max-age=300, s-maxage=21600, stale-while-revalidate=86400",
    );
  } catch (cause) {
    const error = cause instanceof GitHubStatsError ? cause : new GitHubStatsError("GitHub data could not be loaded", "UPSTREAM");
    const messages: Record<GitHubStatsError["code"], string> = {
      CONFIG: "The service is not configured yet.",
      NOT_FOUND: "That GitHub user could not be found.",
      RATE_LIMIT: "GitHub is temporarily rate limited.",
      UPSTREAM: "GitHub data could not be loaded.",
    };
    return svgResponse(renderGitHubError(card, username, messages[error.code]), "public, max-age=30, s-maxage=300", error.code);
  }
}
