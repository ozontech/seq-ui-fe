const filterOptionsIndexes = (options: string[], value: string, exclude?: string[]): number[] => {
  const excludeSet = new Set(exclude)
  const substringIndex = (option: string, value: string) => option
    .toLowerCase()
    .indexOf(value.toLowerCase())

  return options.reduce((acc, option, itemIndex) => {
    const charIndex = substringIndex(option, value)
    if (!excludeSet.has(option) && charIndex >= 0) {
      acc.push({
        option,
        charIndex,
        itemIndex,
      })
    }
    return acc
  }, [] as { option: string; charIndex: number; itemIndex: number }[])
    .sort((a, b) => {
      // Сначала сортируем по позиции совпадения (чем раньше в строке, тем выше)
      if (a.charIndex < b.charIndex) return -1
      if (a.charIndex > b.charIndex) return 1

      // Если позиции совпадения равны, сортируем по длине строки (чем короче, тем выше)
      if (a.option.length < b.option.length) return -1
      if (a.option.length > b.option.length) return 1

      return 0
    })
    .map(({ itemIndex }) => itemIndex)
}

export const filterOptions = (
  options: string[], value: string, exclude?: string[]
): string[] => {
  const indexes = filterOptionsIndexes(options, value, exclude)
  return indexes.map((index) => options[index])
}

export const filterRecords = <T extends Record<string, unknown>, const F extends keyof T>(
  records: T[], field: F, value: string, exclude?: string[]
): T[] => {
  const options = records.map((record) => String(record[field]))
  const indexes = filterOptionsIndexes(options, value, exclude)
  return indexes.map((index) => records[index])
}

