import DOMPurify from "dompurify";

/**
 * Sanitize HTML to prevent XSS attacks while preserving
 * legitimate rich-text formatting (headings, lists, links, tables, etc.).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Headings
      "h1", "h2", "h3", "h4", "h5", "h6",
      // Block elements
      "p", "br", "hr", "div", "span",
      // Text formatting
      "strong", "b", "em", "i", "u", "s", "del", "ins", "sub", "sup",
      // Lists
      "ul", "ol", "li",
      // Links
      "a",
      // Tables
      "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
      // Other
      "blockquote", "pre", "code", "figure", "figcaption",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel",
      "colspan", "rowspan", "scope",
      "class", "id",
      "style",
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Check if HTML content is effectively empty
 * (contains no visible text or meaningful elements).
 */
export function isHtmlEmpty(html: string): boolean {
  if (!html) return true;
  const stripped = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return stripped.length === 0;
}
