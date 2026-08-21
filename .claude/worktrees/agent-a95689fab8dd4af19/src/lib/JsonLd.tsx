/**
 * JsonLd — injects a JSON-LD script tag into the page.
 * Must be a .tsx file to support JSX syntax.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
