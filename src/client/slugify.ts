export const slugify = (id: string, name: string): string => {
  const slugName = name
    .toLowerCase()
    .replace(" ", "-")
    .replace(/[^a-z_]/g, "");

  return `${id}-${slugName}`;
};
