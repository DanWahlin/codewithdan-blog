# Astro Blog Build Instructions

## Goal
Recreate the WordPress "Code with Dan" blog in Astro, matching the current look and feel exactly.

## Reference Files (in this directory)
- `reference-homepage.html` — current WordPress homepage HTML
- `reference-post.html` — current WordPress single post page HTML
- `reference-child-theme.css` — Dan's custom child theme CSS (the main styling)
- `reference-inline-styles.html` — inline styles from the homepage

## Current Astro Setup
- Content is already converted: `src/content/blog/` has 116 markdown posts
- Content schema is in `src/content.config.ts` (fields: title, date, categories, tags, coverImage)
- Images are in `public/images/blog/<post-slug>/` with absolute paths in markdown
- Logo is at `public/images/codeWithDanLogo.png`
- Favicon at `public/favicon.png`
- Dependencies installed, basic Astro blog template in place

## Design Requirements (match the WordPress theme exactly)

### Layout
- **Header**: Logo (codeWithDanLogo.png) on left, nav links on right (Training, Videos, Contact linking to codewithdan.com)
- **Two-column layout**: Main content left (~75%), sidebar right (~25%)
- **Footer**: Simple with copyright, social links, gray background (#B3B3B3)

### Homepage (blog listing)
- Post list with: thumbnail image, post title (linked), date, excerpt (first ~200 chars of content)
- Pagination (10 posts per page)
- Sidebar with: social icons (Twitter/X, LinkedIn, GitHub, YouTube, RSS), search box, category list

### Single Post Page
- Full post title, date, categories shown
- Full markdown content rendered
- Code syntax highlighting (use Astro's built-in Shiki)
- Disqus comments section (or placeholder for it)
- Same sidebar as homepage

### Styling (from reference-child-theme.css)
- Font: Roboto, 15pt, line-height 1.66667em
- Blue accent color (#08c / #0073cc)
- Header: border-bottom 1px solid #ccc
- Sidebar: light background (#fafafa), 5px left padding
- Footer colophon: #B3B3B3 background
- Code blocks: #fcfcfc background, #d6d6d6 border, 14pt font
- Entry content: text-align justify, 30px top margin
- Max width: 1155px centered
- Responsive: sidebar goes full-width below 1024px

### Fonts & Icons
- Google Fonts: Roboto (300, 400, 400i, 700, 900)
- Font Awesome 4.7 for social icons (or modern equivalent)

### Navigation Links
- Training → //codewithdan.com/products/productType/training
- Videos → //codewithdan.com/products/productType/videos  
- Contact → //codewithdan.com/contact

### Social Links
- Twitter/X: https://twitter.com/danwahlin
- LinkedIn: https://www.linkedin.com/in/danwahlin/
- GitHub: https://github.com/danwahlin
- YouTube: https://www.youtube.com/channel/UCtbxTmNfHcXLV5nfpnQxFkw
- RSS: /rss.xml

## Technical Notes
- Use plain CSS (no Tailwind) to match the WordPress theme closely
- The child theme CSS can be adapted directly
- Keep Astro's scoped styles where it makes sense, but global styles for the theme
- Blog posts use `index.md` format in per-post directories
- Post URLs should match WordPress slugs: `/blog/<slug>/` (currently: `/<slug>/`)
- Actually, keep URLs as `/blog/<slug>/` for now, we can add redirects later
- RSS feed should work (Astro has @astrojs/rss)

## What NOT to do
- Don't change the content schema or markdown files
- Don't add Tailwind or any CSS framework
- Don't over-engineer — keep it simple, it's a static blog

## Publishing
- Push content and code changes to `main` when they are ready to save, review, or share.
- Production deploys only happen from tags that match `publish-*`.
- To publish the current commit:
  ```bash
  git tag -a publish-YYYY-MM-DD -m "Publish blog"
  git push origin publish-YYYY-MM-DD
  ```
- GitHub Pages and the VM fallback webhook both use the `publish-*` tag as the deployment trigger.
