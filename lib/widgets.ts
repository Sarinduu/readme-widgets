export const widgetNames = ["title", "subtitle", "typing", "browser", "footer"] as const;
export type WidgetName = (typeof widgetNames)[number];
type Params = Pick<URLSearchParams, "get">;

const palette = {
  paper: "#F7F1E8", surface: "#FCFAF6", border: "#DDD2C3",
  ink: "#2C2925", muted: "#8B8175", mid: "#625B52",
  forest: "#345D57", copper: "#B98245", gold: "#D2A162",
};

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]!);
}

function rawText(params: Params, key: string, fallback: string, limit = 120) {
  return (params.get(key) || fallback).trim().slice(0, limit);
}

function text(params: Params, key: string, fallback: string, limit = 120) {
  return escapeXml(rawText(params, key, fallback, limit));
}

function textWidth(value: string, fontSize: number, monospace = false) {
  if (monospace) return value.length * fontSize * 0.61;
  const units = [...value].reduce((total, character) => {
    if (/[ilI1.,'|!]/.test(character)) return total + 0.28;
    if (/[mwMW@#%&]/.test(character)) return total + 0.9;
    if (/\s/.test(character)) return total + 0.32;
    return total + 0.56;
  }, 0);
  return units * fontSize;
}

function color(params: Params, key: string, fallback: string) {
  const value = (params.get(key) || fallback).trim();
  return /^(#[\da-f]{3,8}|[a-z]{3,20}|transparent)$/i.test(value) ? value : fallback;
}

function number(params: Params, key: string, fallback: number, min: number, max: number) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function svg(width: number, height: number, label: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  ${body}
</svg>`;
}

function renderTitle(params: Params) {
  const rawValue = rawText(params, "text", "Tech Stack", 90);
  const value = escapeXml(rawValue);
  const accent = color(params, "accent", palette.gold);
  const explicitText = params.get("color");
  const foreground = color(params, "color", "#F8F6F1");
  const line = color(params, "line", palette.mid);
  const requestedSize = number(params, "size", 25, 16, 38);
  const size = requestedSize;
  const measuredWidth = Math.ceil(textWidth(rawValue, size) + 8);
  const canvasWidth = Math.max(900, measuredWidth + 600);
  const center = canvasWidth / 2;
  const leftText = center - measuredWidth / 2;
  const rightText = center + measuredWidth / 2;
  const leftDot = Math.round(leftText - 80);
  const rightDot = Math.round(rightText + 80);
  const lowerLeft = Math.round(leftText - 36);
  const lowerRight = Math.round(rightText + 36);
  const theme = explicitText
    ? `.t{fill:${foreground}}.line{stroke:${line}}`
    : `.t{fill:#F8F6F1}.line{stroke:${line}}@media(prefers-color-scheme:light){.t{fill:${palette.ink}}.line{stroke:${palette.border}}}`;

  return svg(canvasWidth, 92, value, `<style>${theme}</style>
  <path id="titlePath" class="line" d="M100 46H${leftDot}c31 0 38-26 70-26H${rightDot - 70}c32 0 39 26 70 26H${canvasWidth - 100}" fill="none" stroke-width="1.2"/>
  <path class="line" d="M${lowerLeft} 65C${lowerLeft + 24} 78 ${lowerRight - 24} 78 ${lowerRight} 65" fill="none" stroke-width="1" stroke-dasharray="3 6"><animate attributeName="stroke-dashoffset" values="0;-18" dur="3s" repeatCount="indefinite"/></path>
  <path d="M100 46H${leftDot}M${rightDot} 46H${canvasWidth - 100}" stroke="${accent}" stroke-opacity=".6"/>
  <g fill="${accent}"><circle cx="${leftDot}" cy="46" r="4"/><circle cx="${leftDot + 35}" cy="30" r="2.5" opacity=".65"/><circle cx="${rightDot - 35}" cy="30" r="2.5" opacity=".65"/><circle cx="${rightDot}" cy="46" r="4"/><circle cx="${center}" cy="73" r="3"/></g>
  <circle r="2.5" fill="${accent}"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#titlePath"/></animateMotion><animate attributeName="opacity" values="0;1;1;0" dur="5s" repeatCount="indefinite"/></circle>
  <text class="t" x="${center}" y="55" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="${size}" font-weight="650" letter-spacing=".4">${value}</text>`);
}

function renderSubtitle(params: Params) {
  const rawValue = rawText(params, "text", "Frontend", 70);
  const value = escapeXml(rawValue);
  const explicitText = params.get("color");
  const foreground = color(params, "color", palette.muted);
  const line = color(params, "line", palette.mid);
  const requestedSize = number(params, "size", 14, 10, 24);
  const size = requestedSize;
  const measuredWidth = Math.ceil(textWidth(rawValue, size) + 6);
  const canvasWidth = Math.max(420, measuredWidth + 240);
  const center = canvasWidth / 2;
  const leftEnd = Math.round(center - measuredWidth / 2 - 20);
  const rightStart = Math.round(center + measuredWidth / 2 + 20);
  const theme = explicitText
    ? `.t{fill:${foreground}}.l{stroke:${line}}`
    : `.t{fill:${palette.muted}}.l{stroke:${line}}@media(prefers-color-scheme:light){.t{fill:${palette.mid}}.l{stroke:${palette.border}}}`;

  return svg(canvasWidth, 36, value, `<style>${theme}</style>
  <path class="l" d="M20 18H${leftEnd}M${rightStart} 18H${canvasWidth - 20}"><animate attributeName="opacity" values=".35;1;.35" dur="3s" repeatCount="indefinite"/></path>
  <text class="t" x="${center}" y="23" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="${size}" font-weight="600">${value}</text>`);
}

function renderTyping(params: Params) {
  const raw = (params.get("text") || "Software Engineer|Full-Stack Developer|Open Source Builder")
    .split("|").map((item) => item.trim().slice(0, 42)).filter(Boolean).slice(0, 3);
  const phrases = raw.length ? raw : ["Software Engineer"];
  const foreground = color(params, "color", palette.ink);
  const accent = color(params, "accent", palette.copper);
  const duration = number(params, "duration", 6, 3, 10);
  const total = duration * phrases.length;
  const darkColor = params.get("color") ? foreground : "#F8F6F1";
  const contentWidth = Math.ceil(Math.max(...phrases.map((phrase) => phrase.length * 28 * .64)) + 32);
  const canvasWidth = Math.max(520, contentWidth + 120);
  const center = canvasWidth / 2;
  const revealWidth = contentWidth;
  const revealStart = Math.round(center - revealWidth / 2);
  const revealEndX = Math.round(center + revealWidth / 2);

  const phraseGroups = phrases.map((phrase, index) => {
    const begin = index * duration;
    const revealEnd = (duration * .35 / total).toFixed(4);
    const holdEnd = (duration * .68 / total).toFixed(4);
    const eraseEnd = (duration * .92 / total).toFixed(4);
    const segmentEnd = (duration / total).toFixed(4);
    return `<g opacity="0">
    <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;${segmentEnd};${segmentEnd};1" dur="${total}s" begin="${begin}s" repeatCount="indefinite"/>
    <g clip-path="url(#reveal${index})"><text class="typingText" x="${center}" y="43" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="28" font-weight="700">${escapeXml(phrase)}</text></g>
    <rect x="${revealStart}" y="17" width="3" height="34" fill="${accent}"><animate attributeName="x" values="${revealStart};${revealEndX};${revealEndX};${revealStart};${revealStart};${revealStart}" keyTimes="0;${revealEnd};${holdEnd};${eraseEnd};${segmentEnd};1" dur="${total}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1;0;1" dur=".8s" repeatCount="indefinite"/></rect>
  </g>`;
  }).join("\n  ");

  const clips = phrases.map((_, index) => {
    const begin = index * duration;
    const revealEnd = (duration * .35 / total).toFixed(4);
    const holdEnd = (duration * .68 / total).toFixed(4);
    const eraseEnd = (duration * .92 / total).toFixed(4);
    const segmentEnd = (duration / total).toFixed(4);
    return `<clipPath id="reveal${index}"><rect x="${revealStart}" y="0" width="0" height="68"><animate attributeName="width" values="0;${revealWidth};${revealWidth};0;0;0" keyTimes="0;${revealEnd};${holdEnd};${eraseEnd};${segmentEnd};1" dur="${total}s" begin="${begin}s" repeatCount="indefinite"/></rect></clipPath>`;
  }).join("");

  return svg(canvasWidth, 68, escapeXml(phrases.join(", ")), `<title>${escapeXml(phrases.join(", "))}</title><desc>Animated typewriter-style titles.</desc>
  <defs>${clips}<style>.typingText{fill:${foreground}}@media(prefers-color-scheme:dark){.typingText{fill:${darkColor}}}</style></defs>
  ${phraseGroups}`);
}

function renderBrowser(params: Params) {
  const url = text(params, "url", "sarindu.dev", 80);
  const background = color(params, "background", palette.paper);
  const foreground = color(params, "color", palette.mid);
  const accent = color(params, "accent", palette.copper);
  return svg(900, 52, `Browser header showing ${url}`, `<rect x="1" y="1" width="898" height="50" rx="15" fill="${background}" stroke="${palette.border}" stroke-width="2"/>
  <circle cx="27" cy="26" r="6" fill="${accent}"/><circle cx="47" cy="26" r="6" fill="${palette.gold}"/><circle cx="67" cy="26" r="6" fill="${palette.forest}"/>
  <rect x="275" y="13" width="350" height="26" rx="13" fill="${palette.surface}" stroke="${palette.border}"/>
  <circle cx="298" cy="26" r="4.5" fill="none" stroke="${palette.muted}" stroke-width="1.2"/><path d="M298 21.5v9m-4.5-4.5h9" stroke="${palette.muted}" stroke-width=".8" opacity=".55"/>
  <text x="450" y="30" text-anchor="middle" fill="${foreground}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" font-weight="600">${url}</text>
  <path d="M848 22h18m-18 7h18" stroke="${palette.muted}" stroke-width="1.5" stroke-linecap="round"/>`);
}

function renderFooter(params: Params) {
  const value = text(params, "text", "Keep building. Keep learning.", 80);
  const status = text(params, "status", "READY", 16);
  const note = text(params, "note", "VISITOR LOG", 20);
  const background = color(params, "background", palette.paper);
  const foreground = color(params, "color", palette.ink);
  const accent = color(params, "accent", palette.copper);
  return svg(900, 48, value, `<rect x="1" y="1" width="898" height="46" rx="12" fill="${background}" stroke="${palette.border}" stroke-width="2"/>
  <circle cx="28" cy="24" r="4" fill="${palette.forest}"/><text x="42" y="28" fill="${palette.muted}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10">${status}</text>
  <text x="450" y="29" text-anchor="middle" fill="${foreground}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="12" font-weight="600">${value}</text>
  <path d="M785 18h15v12h-15z" fill="none" stroke="${accent}" stroke-width="1.2"/><circle cx="792.5" cy="24" r="2.2" fill="${palette.gold}"/>
  <text x="872" y="28" text-anchor="end" fill="${palette.muted}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10">${note}</text>`);
}

export function isWidgetName(value: string): value is WidgetName {
  return widgetNames.includes(value as WidgetName);
}

export function renderWidget(name: WidgetName, params: Params) {
  switch (name) {
    case "title": return renderTitle(params);
    case "subtitle": return renderSubtitle(params);
    case "typing": return renderTyping(params);
    case "browser": return renderBrowser(params);
    case "footer": return renderFooter(params);
  }
}
