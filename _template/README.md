# Case study template

Copy `dqn/` as a starting point for a new case study:

1. Duplicate the folder: `cp -r dqn bango` and rename the images in `bango/img/`.
2. In `bango/index.html`, change the `:root` colour tokens and the three fonts to the product's own brand, so each page lives in its product's world.
3. Update `<title>`, the description, canonical URL and `og:` tags, and replace `og.png` (1200 × 630).
4. Add a card for it in the root `index.html` under `#work`: copy the `.case.dqn` block, add a `.case.bango { --c-bg ...; }` theme rule next to the DQN one.
5. Add the URL to `sitemap.xml`, then commit and push. GitHub Pages redeploys in about a minute.
