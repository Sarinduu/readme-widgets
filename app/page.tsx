/* Dynamic SVG API previews intentionally use native img elements. */
/* eslint-disable @next/next/no-img-element */
const widgets = [
  ["Title", "title?text=Tech%20Stack", "The animated section heading I use for major parts of my profile."],
  ["Subtitle", "subtitle?text=Frontend%20Development", "A smaller divider for grouping tools inside my README."],
  ["Typing", "typing?text=Software%20Engineer%7CFull-Stack%20Developer%7COpen%20Source%20Builder", "My rotating professional titles with the original typewriter treatment."],
  ["Browser header", "browser?url=sarindu.dev", "The browser-style header at the top of my profile."],
  ["Footer", "footer?text=Keep%20building.%20Keep%20learning.", "The compact status bar that closes my README."],
] as const;

export default function Home() {
  return <main>
    <nav className="nav shell">
      <a className="brand" href="#top"><span className="brandMark">S/</span> Sarindu&apos;s README Kit</a>
      <div className="navLinks"><a href="#widgets">My widgets</a><a href="#api">Reference</a><a href="https://sarindu.dev">sarindu.dev</a></div>
    </nav>

    <section className="hero shell" id="top">
      <div className="eyebrow"><span /> THE SVG TOOLKIT BEHIND MY GITHUB PROFILE</div>
      <h1>My README,<br /><em>built from small parts.</em></h1>
      <p>A private collection of reusable SVG endpoints made for my own GitHub profile—one visual system, easy to update from a URL.</p>
      <div className="heroActions"><a className="primaryButton" href="#widgets">See my widgets <span>↓</span></a><code>![title](my-domain/api/title?text=Tech%20Stack)</code></div>
      <div className="heroPreview">
        <img src="/api/title?text=README%20Widgets" alt="README Widgets title" />
        <img src="/api/typing?text=Software%20Engineer%7CFull-Stack%20Developer%7COpen%20Source%20Builder" alt="Animated professional titles" />
      </div>
    </section>

    <section className="widgets shell" id="widgets">
      <div className="sectionHeading"><div><span className="kicker">MY COLLECTION</span><h2>Five profile primitives.</h2></div><p>These are the pieces used across my README. Each endpoint keeps the same warm, editorial theme and renders as a lightweight SVG.</p></div>
      <div className="widgetGrid">{widgets.map(([name, path, description], index) => <article className={`widgetCard card${index + 1}`} key={name}>
        <div className="cardTop"><span>0{index + 1}</span><h3>{name}</h3></div><p>{description}</p>
        <div className="preview"><img src={`/api/${path}`} alt={`${name} widget preview`} /></div>
        <a href={`/api/${path}`} target="_blank">Open endpoint <span>↗</span></a>
      </article>)}</div>
    </section>

    <section className="api shell" id="api">
      <div><span className="kicker">PERSONAL API REFERENCE</span><h2>One visual system,<br />controlled by URLs.</h2><p>I can change copy and presentation from query parameters without manually editing and committing a new SVG every time.</p></div>
      <div className="codePanel"><div className="codeHeader"><i /><i /><i /><span>README.md</span></div><pre><span className="muted">&lt;!-- A section in my profile README --&gt;</span>{`\n`}<span className="pink">![Tech Stack]</span>(<span className="green">https://my-domain/api/title</span>{`\n  `}?<span className="blue">text</span>=Tech%20Stack{`\n  `}&amp;<span className="blue">accent</span>=%23D2A162{`\n  `}&amp;<span className="blue">line</span>=%23625B52{`\n`})</pre></div>
      <div className="parameterRow">{[["text / url", "Widget content"], ["color", "Text color"], ["accent", "Copper/gold accent"], ["background", "Panel background"], ["line", "Title line color"], ["size / duration", "Type-specific tuning"]].map(([key, value]) => <div key={key}><code>{key}</code><span>{value}</span></div>)}</div>
    </section>

    <footer className="siteFooter shell"><span className="brand"><span className="brandMark">S/</span> Sarindu&apos;s README Kit</span><p>A personal tool by Sarindu for keeping my GitHub profile consistent.</p></footer>
  </main>;
}
