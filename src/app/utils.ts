import { User } from "./commonTypes"

export function urlParams2Object(query: URLSearchParams) {
  return {
    s: query.get('s') || "",
    page: Number(query.get('page')) || 1,
    limit: Number(query.get('limit')) || undefined,
    sort: query.get('sort')
  }
}

export function genSortCompareFn(sort: 'asc' | 'desc') {
  return (a: User, b: User) => {
    if (a.first_name < b.first_name) {
      return sort === 'asc' ? -1 : 1
    }
    if (a.first_name > b.first_name) {
      return sort === 'asc' ? 1 : -1
    }
    return 0
  }
}
