export function buildURL(url: string, obj: object): string {
  const entries = Object.entries(obj);

  if (entries.length === 0) {
    return url;
  }

  const query = entries
    .map(pair => pair.map(encodeURIComponent).join("="))
    .join("&");

  return `${url}?${query}`;
}
