# Shivam Mishra – Portfolio

A fast, animated, single-page portfolio for a software and AI engineer. Plain HTML, CSS and JavaScript. There is no build step, no framework and no dependencies, so it runs anywhere that can serve static files.

**Tagline:** Talk to AI in the most efficient way.

## What is in it

- Animated hero with a living network background that reacts to the cursor
- Rotating role line (software engineer, AI engineer)
- Clickable, auto-playing walkthrough of the DocuMind retrieval pipeline
- Filterable project cards with a pointer spotlight
- Design principles accordion
- Light and dark theme (follows the system, with a manual switch that is remembered)
- Contact section with copy buttons
- Respects `prefers-reduced-motion`, works at phone width, keyboard accessible

## Project structure

```
shivam-portfolio/
├── index.html                  Page markup and meta tags
├── styles.css                  Design tokens, layout and animation
├── script.js                   Content (DATA object) and all behavior
├── .github/workflows/pages.yml Deploys to GitHub Pages on every push to main
├── .gitignore
└── README.md
```

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Edit your content

All text on the page comes from the `DATA` object at the top of `script.js`.

| To change | Edit |
| --- | --- |
| Name, roles, tagline, intro | `DATA.profile` |
| Navigation items | `DATA.sections` |
| Pipeline stages | `DATA.pipeline.stages` |
| Projects | `DATA.projects` |
| Design principles | `DATA.principles` |
| Email, phone, social links | `DATA.contact` |

Add a project by appending an entry. Filter chips for any new tags appear automatically.

```js
DATA.projects.push({
  title: "New project",
  kind: "One-line category",
  summary: "What it does for a user.",
  tags: ["GenAI", "Agents"],
  points: ["What you built", "How you measured it"],
  stack: ["Python", "Claude"],
  link: "https://example.com/demo" // optional, shows an "Open the demo" button
});
```

Add GitHub and LinkedIn by adding entries to `DATA.contact`:

```js
{ label: "GitHub", value: "github.com/your-username" },
{ label: "LinkedIn", value: "linkedin.com/in/your-username" }
```

Colors live as CSS variables at the top of `styles.css`. The light palette is on `:root`, and the dark palette is repeated in the two dark blocks below it.

## Put it on GitHub

```bash
cd shivam-portfolio
git init -b main
git add .
git commit -m "Add portfolio"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Deploy

**GitHub Pages (workflow included).** In the repository go to Settings, then Pages, and set Source to GitHub Actions. Every push to `main` publishes the site.

**Vercel or Netlify.** Import the repository. Leave the framework as "Other", leave the build command empty and set the output directory to the repository root.

## About the "Ask Claude" panel

On claude.ai the page can ask Claude questions about the portfolio through the Artifacts runtime. Outside claude.ai that runtime does not exist, so the panel and its navigation link hide themselves and everything else works normally.

To enable a live Q&A on your own domain, add a small backend endpoint that calls the Claude API with the `DATA` content as context, then replace the `mountAsk()` function in `script.js` with a call to that endpoint. Keep your API key on the server and never put it in this repository.

## Fonts

Instrument Serif, Geist and Geist Mono load from Google Fonts. If they are blocked, the page falls back to system serif, sans-serif and monospace fonts.
