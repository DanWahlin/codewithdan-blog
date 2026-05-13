# CodeWithDan Blog From Obsidian

This repo can publish a post authored in Dan's Obsidian repo without manual copying.

## Manual Publish

```bash
npm run publish:obsidian -- <slug>
```

Useful flags:

```bash
npm run publish:obsidian -- <slug> --dry-run
npm run publish:obsidian -- <slug> --push
npm run publish:obsidian -- <slug> --draft
npm run publish:obsidian -- <slug> --obsidian /path/to/obsidian
```

The script expects this source shape in the Obsidian repo:

```text
blog/codewithdan/
  src/content/blog/<slug>/index.md
  public/images/blog/<slug>/...
  source-assets/<slug>/...
```

It copies into this Astro blog shape:

```text
src/content/blog/<slug>/index.md
public/images/blog/<slug>/...
```

## Safety Rails

- Pulls both repos first unless `--no-pull` is passed.
- Refuses to run with dirty repos before pull.
- Converts production frontmatter to `draft: false` unless `--draft` is passed.
- Validates that Markdown uses `/images/blog/<slug>/...` URLs instead of Obsidian embeds or relative asset paths.
- Scans for obvious secret/token/user-id shaped values.
- Runs `npm run build` unless `--no-build` is passed.
- Stages only the post, its public assets, and its generated OG image when committing.

## GitHub PR Automation

The Obsidian repo contains `.github/workflows/codewithdan-blog-pr.yml`. It checks out this repo, runs the same sync helper from Obsidian, builds the blog, and opens/updates a PR here.

That workflow requires a secret in `DanWahlin/obsidian`:

```text
CODEWITHDAN_BLOG_PR_TOKEN
```

The token needs access to `DanWahlin/codewithdan-blog` with contents write and pull request write permissions. Fine-grained PAT preferred. Classic PAT works too, but it's a bigger hammer.
