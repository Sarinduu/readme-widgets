import { isWidgetName, renderWidget } from "@/lib/widgets";

export async function GET(
  request: Request,
  context: { params: Promise<{ widget: string }> },
) {
  const { widget } = await context.params;

  if (!isWidgetName(widget)) {
    return Response.json(
      { error: "Unknown widget", widgets: ["title", "subtitle", "typing", "browser", "footer"] },
      { status: 404 },
    );
  }

  const svg = renderWidget(widget, new URL(request.url).searchParams);
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-cache, must-revalidate",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
