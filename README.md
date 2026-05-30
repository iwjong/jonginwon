# jonginwon.com

Personal portfolio of Inwon Jong — interaction designer, Co-founder and Chief Design Officer at [FREN Inc.](https://www.jonginwon.com/about/)

**Live:** [jonginwon.com](https://www.jonginwon.com)

---

## Why this site exists

After years of designing at scale — mobile products at Samsung Electronics across 30+ projects, platform-level UX structure, and interaction frameworks built for millions of devices — I wanted a portfolio that reflects how I practice design today: simple structures, high-impact moments, and room for the work to speak first.

At FREN, that practice centers on immersive experiences for children's museums and pediatric healthcare — environments where interaction must be clear, emotional, and humane. This site applies the same thinking to how the work is presented. It is not a résumé layout or a searchable project directory. It is a curated archive of interaction, identity, and experience design — presented the way I would walk someone through a physical exhibition.

## Why it stays minimal

The restraint is deliberate, not decorative.

**Navigation stays out of the way.** Only the name and About appear in the header. There are no category menus, filters, or sidebars competing with the work. The visitor's attention belongs to the projects, not the interface chrome.

**The home page favors discovery over sorting.** Images from every project are shuffled into a continuous feed. There is no chronological index or taxonomy to browse through first. Scroll, notice, click — the experience is closer to wandering a gallery than scanning a table of contents.

**Each project page follows one editorial rhythm.** Title, year, a brief paragraph of context, then a vertical sequence of visuals. The structure is consistent; the length and pacing vary with each story. A full-screen slide viewer handles detail inspection without breaking the scroll narrative.

**The build stays static and direct.** Plain HTML, shared CSS, and image assets — no CMS, no framework overhead. The layout system is the product. Updates stay lightweight, and the presentation remains under full design control.

Minimal here means intentional reduction: fewer decisions for the visitor, more space for the work.

## Layout as communication

The site uses a small set of surfaces, each with a distinct role:

| Surface | Role |
|---------|------|
| Home feed | Discovery — unexpected connections between projects as you scroll |
| Project page | Story — context first, then a sequential visual narrative |
| Slide viewer | Inspection — focused, full-screen detail on demand |
| About | Practice — background, current work, and contact |

On project pages, feature images follow a shared naming convention (`fd-*`) and markup pattern (`main-project-*`). Every project reads with the same typographic and spatial rhythm while allowing its own length and image count. The home feed pulls from the same image pools, shuffled across projects so no single body of work dominates the entry experience.

Responsive breakpoints, lazy loading, and semantic metadata (Open Graph, structured data, sitemap) support findability and performance without adding visible UI.

## Design principles

1. **Work before chrome** — the interface should never explain itself at the expense of the projects
2. **Consistent narrative rhythm** — shared structure across projects, flexible content within it
3. **Discovery over taxonomy** — browse and encounter; don't categorize and filter
4. **Long-lived publishing** — a site that can be maintained for years without platform dependency
5. **Quiet infrastructure** — accessibility, SEO, and performance handled beneath the surface

## How to read this site

- **Home** — scroll the image feed; click any image to enter a project
- **Project pages** — read the short context, follow the visual sequence; open the slide viewer for closer inspection
- **About** — background on FREN, prior work at Samsung, and how to connect

## What this repository is

This repo is the source for [jonginwon.com](https://www.jonginwon.com) — a static, designer-maintained portfolio. It is a personal design archive, not a case-study blog, agency site, or component library.

For deployment and DNS setup, see [docs/deploy.md](docs/deploy.md).
