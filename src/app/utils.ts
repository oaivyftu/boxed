export function urlParams2Object(query: URLSearchParams) {
  return {
    s: query.get('s') || "",
    page: Number(query.get('page')) || 1,
    limit: Number(query.get('limit')) || undefined,
    sort: query.get('sort')
  }
}
