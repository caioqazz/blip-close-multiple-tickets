export const sortData = (data: Array<any>, sort: any): Array<any> => {
  if (data !== undefined && data.length > 1) {
    data.sort(
      sort.order === 'asc'
        ? (a, b) =>
            a[sort.property] > b[sort.property]
              ? 1
              : b[sort.property] > a[sort.property]
              ? -1
              : 0
        : (a, b) =>
            a[sort.property] < b[sort.property]
              ? 1
              : b[sort.property] < a[sort.property]
              ? -1
              : 0
    )
  }
  return data
}
