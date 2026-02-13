export function getExcerpt(body: string, maxLength = 300): string {
	const stripped = body
		.replace(/^---[\s\S]*?---/, '')           // frontmatter
		.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '') // linked images
		.replace(/!\[.*?\]\(.*?\)/g, '')           // standalone images
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // [text](url) → text
		.replace(/\]\([^)]*\)/g, '')               // leftover ](url)
		.replace(/\[([^\]]*)\]/g, '$1')            // [text] → text
		.replace(/\[/g, '')                        // stray opening brackets
		.replace(/\]/g, '')                        // stray closing brackets
		.replace(/#{1,6}\s/g, '')                  // headings
		.replace(/[*_~`]/g, '')                    // emphasis
		.replace(/<[^>]+>/g, '')                   // HTML tags
		.replace(/&[a-z]+;/gi, ' ')                // HTML entities
		.replace(/https?:\/\/\S+/g, '')            // bare URLs
		.replace(/✅|📝|🚀|💡|⚡|🎯/g, '')        // emoji bullets
		.replace(/\n+/g, ' ')                      // newlines
		.replace(/\s{2,}/g, ' ')                   // multiple spaces
		.trim();
	if (stripped.length <= maxLength) return stripped;
	return stripped.substring(0, maxLength).replace(/\s+\S*$/, '') + ' …';
}

export function getCoverImagePath(post: { id: string; data: { coverImage?: string } }): string | null {
	if (post.data.coverImage) {
		return `/images/blog/${post.id}/${post.data.coverImage}`;
	}
	return null;
}
