# Add this after the initial GitHub upload

This package is the browser refinement that follows the initial repository upload. It supersedes earlier browser game files. It is not a replacement for the existing iPhone source tree.

## Apply the package

1. Extract `SpaceTrader-GitHub-Update.zip`.
2. Open the extracted `SpaceTrader-GitHub-Update` folder. Copy its **contents** into the root of your existing repository; do not put that containing folder inside the repository.
3. Replace the earlier `SpaceTrader-browser.html`, `docs/SpaceTrader-browser.html`, and `docs/index.html` with the versions supplied here.
4. Add the accompanying documentation, scripts, checks, fixture, and license notices. If the repository already has a README, package configuration, license, notice, or ignore file, merge the supplied content with it so existing project instructions remain available.
5. Keep the existing native iPhone code, source archives, and unrelated repository files. They are outside this browser update.
6. Review the resulting changes and commit them. Nothing in this ZIP pushes a commit or enables publishing automatically.

| Path | Purpose |
| --- | --- |
| `SpaceTrader-browser.html` | Latest standalone game and editable source of truth |
| `docs/SpaceTrader-browser.html` | Identical copy for the existing browser URL |
| `docs/index.html` | Small local entry page; no external fonts or assets |
| `README.md`, `CHANGELOG.md` | Current feature writeup and release scope |
| `PLAYTEST_RESULTS.md`, `PLAYTEST_PLAN.md` | Simulation evidence and human test plan |
| `CHEATS.md` | Developer console instructions |
| `IPHONE_ROADMAP.md` | iPhone direction, touch requirements, and remaining native/device work |
| `LICENSE`, `NOTICE.md`, `licenses/` | Attribution and supplied license material |
| `package.json`, `scripts/`, `browser-preview/` | Optional development checks and save-migration fixture |

## GitHub Pages

This repository already has a GitHub Actions workflow at `.github/workflows/pages.yml` that publishes `docs/` when changes land on `main`. After committing this update, check the Actions run before sharing the site. Keep the existing workflow and use the Pages URL shown in repository Settings.

The entry page links to `SpaceTrader-browser.html` using a relative URL, so it also works when the repository is hosted under a project subpath. The game remains on the explicit game-file URL rather than creating a second autosave location at `index.html`.

Official reference: [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Before sharing the updated site

Open the game, choose Easy, and start a new game to see the new regional economy. If keeping an old commander, export the save from the old location before moving it and import it through Commander on the new site.

The automated checks were run for this package; they do not replace a Chrome/phone layout check. The native iPhone project is unchanged and has not been built or signed here.
