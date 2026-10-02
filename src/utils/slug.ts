export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getUniqueSlug(
  value: string,
  existingSlugs: string[],
  currentSlug?: string
) {
  const baseSlug = slugify(value);

  if (!baseSlug) return '';

  const normalizedCurrentSlug = currentSlug?.trim().toLowerCase();
  const slugExists = (slug: string) =>
    existingSlugs.some(
      (existingSlug) =>
        existingSlug.trim().toLowerCase() === slug &&
        existingSlug.trim().toLowerCase() !== normalizedCurrentSlug
    );

  let slug = baseSlug;
  let counter = 1;

  while (slugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
