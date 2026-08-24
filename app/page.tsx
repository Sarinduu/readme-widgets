/* SVG API previews intentionally use native img elements. */
/* eslint-disable @next/next/no-img-element */

const widgets = [
  {
    command: "title",
    name: "Section title",
    description: "Animated heading with text-aware symmetric geometry.",
    path: "title?text=Tech%20Stack",
  },
  {
    command: "subtitle",
    name: "Section subtitle",
    description: "Compact divider with lines that adapt to the label.",
    path: "subtitle?text=Frontend%20Development",
  },
  {
    command: "typing",
    name: "Typing titles",
    description: "Cycles through up to three professional titles.",
    path: "typing?text=Software%20Engineer%7CFull-Stack%20Developer%7COpen%20Source%20Builder",
  },
  {
    command: "browser",
    name: "Browser header",
    description: "The browser-style header used at the top of my profile.",
    path: "browser?url=sarindu.dev",
  },
  {
    command: "footer",
    name: "README footer",
    description: "A compact status bar for the end of my profile.",
    path: "footer?text=Keep%20building.%20Keep%20learning.",
  },
] as const;

const githubCards = [
  { command: "combined", name: "Combined statistics", description: "All three GitHub cards in one README-ready image with consistent row and column spacing.", size: "900 × 596" },
  { command: "overview", name: "Profile overview", description: "A wide summary of contributions, stars, repositories, followers, account age, and monthly activity.", size: "900 × 260" },
  { command: "languages", name: "Top languages", description: "Language distribution across public, owned, non-fork repositories.", size: "442 × 320" },
  { command: "activity", name: "Contribution activity", description: "A 365-day breakdown of commits, pull requests, issues, reviews, and streak metrics.", size: "442 × 320" },
] as const;

const parameters = [
  ["text", "Widget copy or pipe-separated typing phrases"],
  ["url", "Browser address-field content"],
  ["color", "Primary text color"],
  ["accent", "Accent and cursor color"],
  ["line", "Title or subtitle line color"],
  ["background", "Browser or footer background"],
  ["size", "Title and subtitle font size"],
  ["duration", "Seconds per typing phrase"],
  ["username", "GitHub login used by all three stats cards"],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090909] font-mono text-zinc-300">
      <header className="border-b border-zinc-800">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-3 text-sm text-zinc-100">
            <span className="text-green-400">sarindu@readme</span>
            <span className="text-zinc-600">:~$</span>
          </a>
          <div className="flex gap-5 text-xs text-zinc-500 sm:gap-8">
            <a className="hover:text-zinc-100" href="#widgets">./widgets</a>
            <a className="hover:text-zinc-100" href="#reference">./reference</a>
            <a className="hover:text-zinc-100" href="https://sarindu.site">./website</a>
          </div>
        </nav>
      </header>

      <section id="top" className="mx-auto w-full max-w-6xl border-x border-zinc-800 px-5 py-20 sm:px-10 sm:py-28">
        <p className="mb-7 text-xs text-zinc-500">
          <span className="text-green-400">●</span> process: readme-widgets&nbsp;&nbsp;status: online
        </p>
        <p className="mb-4 text-sm text-zinc-500">$ ./introduce.sh</p>
        <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-zinc-100 sm:text-6xl lg:text-7xl">
          Sarindu&apos;s personal<br />README widget service<span className="animate-pulse text-green-400">_</span>
        </h1>
        <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
          Nine server-rendered SVG endpoints used to keep my GitHub profile consistent. No dashboard, accounts, or analytics.
        </p>
        <div className="mt-10 flex flex-col gap-3 text-xs sm:flex-row sm:items-center">
          <a href="#widgets" className="w-fit border border-zinc-600 bg-zinc-100 px-4 py-3 text-zinc-950 hover:bg-white">
            $ list-widgets
          </a>
          <code className="overflow-x-auto border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-500">
            GET /api/title?text=Tech%20Stack
          </code>
        </div>

        <div className="mt-16 border border-zinc-800 bg-zinc-950">
          <div className="flex h-10 items-center justify-between border-b border-zinc-800 px-4 text-[11px] text-zinc-600">
            <span>preview.log</span><span>80×24</span>
          </div>
          <div className="space-y-2 overflow-hidden px-3 py-6 sm:px-8">
            <img className="mx-auto block w-full" src="/api/title?text=README%20Widgets" alt="README Widgets title" />
            <img className="mx-auto block max-w-full" src="/api/typing?text=Software%20Engineer%7CFull-Stack%20Developer%7COpen%20Source%20Builder" alt="Animated professional titles" />
          </div>
        </div>
      </section>

      <section id="github-stats" className="border-b border-zinc-800">
        <div className="mx-auto w-full max-w-6xl border-x border-zinc-800 px-5 py-20 sm:px-10">
          <p className="text-xs text-green-400">$ ls ./api/github</p>
          <h2 className="mt-3 text-3xl text-zinc-100 sm:text-4xl">GitHub statistics</h2>
          <p className="mt-4 max-w-2xl text-xs leading-6 text-zinc-600">Public GitHub data for a supplied username. Results are fetched server-side and cached; the API token is never exposed in the SVG or page.</p>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {githubCards.map((card, index) => (
              <article key={card.command} className={`border border-zinc-800 bg-[#0c0c0c] p-5 sm:p-7 ${index < 2 ? "lg:col-span-2" : ""}`}>
                <div className="flex items-center justify-between gap-4 text-xs"><span className="text-green-400">GET /api/github/{card.command}</span><span className="text-zinc-700">{card.size}</span></div>
                <h3 className="mt-5 text-lg text-zinc-200">{card.name}</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-600">{card.description}</p>
                <div className="mt-6 overflow-x-auto border border-zinc-900 bg-[#070707] p-3">
                  <img className="mx-auto block max-w-full" src={`/api/github/${card.command}?username=sarinduu`} alt={`${card.name} preview`} />
                </div>
                <a className="mt-5 inline-block text-xs text-zinc-500 hover:text-green-400" href={`/api/github/${card.command}?username=sarinduu`} target="_blank">$ open endpoint ↗</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="widgets" className="border-y border-zinc-800">
        <div className="mx-auto w-full max-w-6xl border-x border-zinc-800 px-5 py-20 sm:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-xs text-green-400">$ ls ./api</p><h2 className="mt-3 text-3xl text-zinc-100 sm:text-4xl">Available endpoints</h2></div>
            <p className="max-w-md text-xs leading-6 text-zinc-600">Each response is a standalone, XML-safe SVG. Parameters are supplied through the query string.</p>
          </div>

          <div className="grid border-l border-t border-zinc-800 lg:grid-cols-2">
            {widgets.map((widget, index) => (
              <article key={widget.command} className={`flex min-h-80 flex-col border-b border-r border-zinc-800 bg-[#0c0c0c] p-5 sm:p-7 ${index === 4 ? "lg:col-span-2" : ""}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-400">GET /api/{widget.command}</span>
                  <span className="text-zinc-700">[{String(index + 1).padStart(2, "0")}]</span>
                </div>
                <h3 className="mt-5 text-lg text-zinc-200">{widget.name}</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-600">{widget.description}</p>
                <div className="my-6 flex min-h-32 flex-1 items-center overflow-x-auto border border-zinc-900 bg-[#070707] p-3">
                  <img className="mx-auto block max-w-full" src={`/api/${widget.path}`} alt={`${widget.name} preview`} />
                </div>
                <a className="text-xs text-zinc-500 hover:text-green-400" href={`/api/${widget.path}`} target="_blank">$ open endpoint ↗</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reference" className="mx-auto grid w-full max-w-6xl border-x border-zinc-800 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="border-b border-zinc-800 px-5 py-20 sm:px-10 lg:border-b-0 lg:border-r">
          <p className="text-xs text-green-400">$ cat API.md</p>
          <h2 className="mt-4 text-3xl text-zinc-100 sm:text-4xl">Query reference</h2>
          <p className="mt-5 text-xs leading-6 text-zinc-600">The full endpoint-specific reference, limits, defaults, and Markdown examples live in the project README.</p>
          <a href="https://github.com/sarinduu" className="mt-8 inline-block text-xs text-zinc-400 hover:text-green-400">$ view README.md ↗</a>
        </div>
        <div className="px-5 py-20 sm:px-10">
          <div className="border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 px-4 py-3 text-[11px] text-zinc-600">parameters.env</div>
            {parameters.map(([key, description]) => (
              <div key={key} className="grid gap-2 border-b border-zinc-900 px-4 py-4 text-xs last:border-0 sm:grid-cols-[120px_1fr]">
                <code className="text-green-400">{key}=</code><span className="text-zinc-500">{description}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-x-auto border border-zinc-800 bg-zinc-950 p-5 text-xs leading-6">
            <p className="text-zinc-600"># README usage</p>
            <p><span className="text-zinc-400">![Tech Stack]</span><span className="text-zinc-600">(</span><span className="text-green-400">https://your-project.vercel.app/api/title?text=Tech%20Stack</span><span className="text-zinc-600">)</span></p>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex min-h-24 w-full max-w-6xl flex-col justify-center gap-2 border-x border-zinc-800 px-5 text-[11px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span><span className="text-green-400">sarindu@readme</span>:~$ exit</span>
          <span>process finished with code 0</span>
        </div>
      </footer>
    </main>
  );
}
