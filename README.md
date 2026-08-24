# Sarindu's README Kit

A personal Next.js service that renders the SVG widgets used in my GitHub profile. The widgets share the warm visual language from my original hand-built assets and can be updated through URL parameters instead of editing SVG files.

This project currently provides nine endpoints:

- Browser header
- Animated typing titles
- Section title
- Section subtitle
- README footer
- GitHub profile overview
- GitHub top languages
- GitHub contribution activity
- Combined GitHub statistics

Profile-view counters are intentionally not included.

## Test locally

Install dependencies and start the development server:

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Add a GitHub access token to `.env.local` before testing the statistics cards:

```dotenv
GITHUB_TOKEN=your_token_here
```

The token is server-only. Do not prefix it with `NEXT_PUBLIC_` or commit `.env.local`.

Open an endpoint directly in the browser:

```text
http://localhost:3000/api/title?text=Tech%20Stack
```

Or paste it into a local Markdown file:

```md
![Tech Stack](http://localhost:3000/api/title?text=Tech%20Stack)
```

GitHub cannot load images from `localhost`. Local URLs only work in a local Markdown preview while the development server is running. After deployment, replace `http://localhost:3000` with the public deployment URL.

## URL rules

- Encode spaces as `%20`.
- Encode `#` in hex colors as `%23`.
- Separate typing phrases with `%7C`, the URL-encoded form of `|`.
- Use the optional `v` parameter to invalidate an old browser/CDN copy after a design change.
- Unsupported colors fall back to the widget default.
- All text is length-limited and XML-escaped before rendering.
- Undocumented and duplicate parameters are rejected with `400`.
- Query strings longer than 2,048 characters or containing more than 10 parameters are rejected.
- SVG responses use `image/svg+xml`, cache in browsers for five minutes, and cache on a CDN for one day.
- GitHub cards accept only `username` and use a six-hour shared/CDN cache.

## Browser header

**Endpoint:** `/api/browser`

Recreates the cream browser bar used at the top of my README, including the three status dots, address field, and menu icon.

| Parameter | What it does | Default |
| --- | --- | --- |
| `url` | Text shown in the address field. Maximum 80 characters. | `sarindu.dev` |
| `color` | Address text color. | `#625B52` |
| `accent` | First browser-dot color. | `#B98245` |
| `background` | Main browser-bar background. | `#F7F1E8` |

```md
![Browser Header](http://localhost:3000/api/browser?url=sarindu.dev)
```

Customized example:

```md
![Browser Header](http://localhost:3000/api/browser?url=github.com%2Fsarinduu&accent=%23B98245)
```

## Typing titles

**Endpoint:** `/api/typing`

Cycles through one to three professional titles. Each phrase is revealed, held, erased, and followed by the next phrase. The SVG and reveal mask automatically grow with extra safety space around the longest accepted phrase, so long titles are not clipped. The original underline and bottom dot are removed.

| Parameter | What it does | Default |
| --- | --- | --- |
| `text` | One to three phrases separated by `|`. Each phrase is limited to 42 characters. | `Software Engineer\|Full-Stack Developer\|Open Source Builder` |
| `color` | Text color. When omitted, the text automatically switches between `#2C2925` and `#F8F6F1` for light/dark themes. | Theme-aware |
| `accent` | Animated cursor color. | `#B98245` |
| `duration` | Seconds spent typing, holding, and erasing each phrase. Allowed range: `3`–`10`. | `6` |

```md
![Typing Titles](http://localhost:3000/api/typing?text=Software%20Engineer%7CFull-Stack%20Developer%7COpen%20Source%20Builder)
```

Slower two-title example:

```md
![Typing Titles](http://localhost:3000/api/typing?text=Software%20Engineer%7COpen%20Source%20Builder&duration=8)
```

## Section title

**Endpoint:** `/api/title`

Renders the large animated section divider with curved lines, moving marker, dashed lower arc, and gold details. Its canvas and every decorative point are calculated symmetrically from the text bounds, so longer titles keep equal clearance on both sides.

| Parameter | What it does | Default |
| --- | --- | --- |
| `text` | Section heading. Maximum 90 characters. | `Tech Stack` |
| `color` | Heading color. When omitted, it follows the viewer's light/dark theme. | Theme-aware |
| `accent` | Dots, outer lines, and moving marker color. | `#D2A162` |
| `line` | Curved and dashed decorative line color. | `#625B52` |
| `size` | Font size. Allowed range: `16`–`38`; the SVG width grows when needed. | `25` |

```md
![Tech Stack](http://localhost:3000/api/title?text=Tech%20Stack)
```

Long-title example:

```md
![Open Source Projects](http://localhost:3000/api/title?text=Open%20Source%20Projects%20and%20Experiments)
```

Customized example:

```md
![Current Projects](http://localhost:3000/api/title?text=Current%20Projects&accent=%23B98245&line=%23DDD2C3&size=28)
```

## Section subtitle

**Endpoint:** `/api/subtitle`

Renders a compact subsection label between two animated lines. The SVG width and equal line gaps adapt to the label width.

| Parameter | What it does | Default |
| --- | --- | --- |
| `text` | Subsection label. Maximum 70 characters. | `Frontend` |
| `color` | Label color. When omitted, it follows the viewer's light/dark theme. | Theme-aware |
| `line` | Color of the animated side lines. | `#625B52` |
| `size` | Font size. Allowed range: `10`–`24`; the SVG width grows when needed. | `14` |

```md
![Frontend](http://localhost:3000/api/subtitle?text=Frontend%20Development)
```

Long-label example:

```md
![Tools](http://localhost:3000/api/subtitle?text=Design%2C%20Development%20and%20Productivity%20Tools)
```

## README footer

**Endpoint:** `/api/footer`

Renders the cream status bar used to close my README, with a left status indicator, centered message, and right-side visitor-log decoration.

| Parameter | What it does | Default |
| --- | --- | --- |
| `text` | Center footer message. Maximum 80 characters. | `Keep building. Keep learning.` |
| `status` | Small label on the left. Maximum 16 characters. | `READY` |
| `note` | Small label on the right. Maximum 20 characters. | `VISITOR LOG` |
| `color` | Center message color. | `#2C2925` |
| `accent` | Right-side outlined icon color. | `#B98245` |
| `background` | Footer background color. | `#F7F1E8` |

```md
![README Footer](http://localhost:3000/api/footer?text=Keep%20building.%20Keep%20learning.)
```

Customized labels:

```md
![README Footer](http://localhost:3000/api/footer?text=Thanks%20for%20visiting.&status=ONLINE&note=SARINDU.DEV)
```

## Combined GitHub statistics

**Endpoint:** `/api/github/combined`

Renders all three statistics cards as one `900 × 596` SVG. The `900 × 260` overview is placed in the first row. After a `16px` vertical gap, the two `442 × 320` cards are placed side by side with a `16px` gap between them.

| Parameter | What it does | Default |
| --- | --- | --- |
| `username` | GitHub login to load. Required; 1–39 characters. | None |

```md
![GitHub Statistics](http://localhost:3000/api/github/combined?username=sarinduu)
```

## GitHub profile overview

**Endpoint:** `/api/github/overview`

Renders a `900 × 260` horizontal card with the account name, contributions from the last year, stars, public repository count, followers, account age, and a 12-month activity graph.

| Parameter | What it does | Default |
| --- | --- | --- |
| `username` | GitHub login to load. Required; 1–39 characters. | None |

```md
![GitHub Overview](http://localhost:3000/api/github/overview?username=sarinduu)
```

## GitHub top languages

**Endpoint:** `/api/github/languages`

Renders a `442 × 320` vertical card containing the five largest languages by byte size. Archived repositories and forks are omitted.

| Parameter | What it does | Default |
| --- | --- | --- |
| `username` | GitHub login to load. Required; 1–39 characters. | None |

```md
![Top Languages](http://localhost:3000/api/github/languages?username=sarinduu)
```

## GitHub contribution activity

**Endpoint:** `/api/github/activity`

Renders a `442 × 320` vertical card with a 365-day breakdown of commits, pull requests, issues, and reviews, plus total contributions, active days, current streak, and longest streak.

| Parameter | What it does | Default |
| --- | --- | --- |
| `username` | GitHub login to load. Required; 1–39 characters. | None |

```md
![GitHub Activity](http://localhost:3000/api/github/activity?username=sarinduu)
```

The GitHub API returns at most 100 repositories in the current query. Star, fork, and language totals are therefore based on the 100 most recently pushed public repositories when an account has more than 100. Contribution counts come from GitHub's contribution calendar and may include activity GitHub attributes to the account.

## Full local README example

```md
![Browser Header](http://localhost:3000/api/browser?url=sarindu.dev)

![Typing Titles](http://localhost:3000/api/typing?text=Software%20Engineer%7CFull-Stack%20Developer%7COpen%20Source%20Builder)

![Tech Stack](http://localhost:3000/api/title?text=Tech%20Stack)

![Frontend](http://localhost:3000/api/subtitle?text=Frontend%20Development)

![GitHub Statistics](http://localhost:3000/api/github/combined?username=sarinduu)

![README Footer](http://localhost:3000/api/footer?text=Keep%20building.%20Keep%20learning.)
```

## Vercel deployment and security

This service is designed to run on Vercel Hobby behind Vercel's CDN and automatic DDoS protection. The five decorative widgets need no external services. The four statistics endpoints call GitHub's GraphQL API and require a server-side `GITHUB_TOKEN`; no database is required.

Before deploying, create a GitHub token intended only for this service. Public profile data does not require access to private repositories. Add it in **Vercel → Project → Settings → Environment Variables** as `GITHUB_TOKEN`, enable it for Production and Preview as needed, and redeploy. Never use a token in a README URL.

Successful SVG responses include:

- Five-minute browser caching
- One-day shared/CDN caching with seven-day stale-while-revalidate
- Six-hour shared caching for GitHub data, with one-day stale-while-revalidate
- A restrictive SVG Content Security Policy
- MIME-sniffing protection
- Cross-origin embedding support for GitHub README images

The website also sends Content Security Policy, HSTS, frame-denial, referrer, MIME-sniffing, and browser-permission headers. Error responses are never cached.

After changing a widget design, increment `v` in the README URL:

```md
![Tech Stack](https://your-project.vercel.app/api/title?text=Tech%20Stack&v=2)
```

No application-level rate limiter is enabled by default. Strict username validation, a single permitted query parameter, CDN caching, GitHub's own API limits, and Vercel's platform protection form the first layer. Monitor the Vercel Usage and Firewall dashboards and add a conservative WAF rule only if sustained abuse appears.

## Commands

```bash
pnpm dev                 # Start the local development server
pnpm lint                # Run ESLint
pnpm exec tsc --noEmit   # Check TypeScript
pnpm exec next build --webpack  # Create a production build
pnpm start               # Run the production build
```
