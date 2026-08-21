import { isWidgetName, renderWidget, type WidgetName } from "@/lib/widgets";

const allowedParameters: Record<WidgetName, ReadonlySet<string>> = {
  title: new Set(["text", "color", "accent", "line", "size", "v"]),
  subtitle: new Set(["text", "color", "line", "size", "v"]),
  typing: new Set(["text", "color", "accent", "duration", "v"]),
  browser: new Set(["url", "color", "accent", "background", "v"]),
  footer: new Set(["text", "status", "note", "color", "accent", "background", "v"]),
} as const;

function error(message: string, status: number) {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<{ widget: string }> },
) {
  const { widget } = await context.params;

  if (!isWidgetName(widget)) {
    return error("Unknown widget", 404);
  }

  const url = new URL(request.url);
  if (url.search.length > 2048) {
    return error("Query string is too long", 414);
  }

  const entries = [...url.searchParams.entries()];
  if (entries.length > 10) {
    return error("Too many query parameters", 400);
  }

  const seen = new Set<string>();
  for (const [key] of entries) {
    if (!allowedParameters[widget].has(key)) {
      return error(`Unsupported parameter: ${key}`, 400);
    }
    if (seen.has(key)) {
      return error(`Duplicate parameter: ${key}`, 400);
    }
    seen.add(key);
  }

  const svg = renderWidget(widget, url.searchParams);
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, must-revalidate",
      "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "Content-Disposition": "inline",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
