import { sanitizeHtml } from "../../../utils/sanitize";
import { cn } from "./utils";

interface SanitizedHtmlProps {
  html: string;
  className?: string;
  /** Additional classes applied only when html is empty */
  emptyClassName?: string;
  /** Fallback content rendered when html is empty */
  fallback?: React.ReactNode;
}

/**
 * Renders sanitized HTML safely via dangerouslySetInnerHTML.
 * Replaces the repeated pattern of sanitizeHtml() + dangerouslySetInnerHTML.
 */
export function SanitizedHtml({
  html,
  className,
  emptyClassName,
  fallback,
}: SanitizedHtmlProps) {
  const sanitized = sanitizeHtml(html);

  if (!sanitized && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      className={cn(
        "rich-text-content max-w-full",
        !sanitized && emptyClassName,
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
