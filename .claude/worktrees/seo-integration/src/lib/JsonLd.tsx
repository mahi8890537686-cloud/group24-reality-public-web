/**
 * JsonLd — injects a JSON-LD script tag into the page.
 * Must be a .tsx file to support JSX syntax.
 */
export function JsonLd({ data }: { data: object }) {
  // Several schema builders (aggregateRatingSchema, blogPostingSchema,
  // propertySchema) embed CMS-editable text — a review, blog excerpt, or
  // listing description containing a literal "</script>" would otherwise
  // close this tag early, corrupting the page and opening a stored-XSS
  // path. A raw "<" can't appear unescaped in valid JSON output anywhere
  // except inside a string value, so blanket-escaping it to < is
  // safe for the whole payload, not just the "</script>" case.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
