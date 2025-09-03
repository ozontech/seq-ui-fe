import type { ColumnSizingState } from '@tanstack/table-core'

const getOriginalCellWidth = (cell: Element) => {
  const temp = document.createElement('div')

  const style = window.getComputedStyle(cell)
  temp.style.font = style.font
  temp.style.fontSize = style.fontSize
  temp.style.fontWeight = style.fontWeight
  temp.style.fontFamily = style.fontFamily
  temp.style.padding = style.padding
  temp.style.border = style.border
  temp.style.margin = style.margin
  temp.style.lineHeight = style.lineHeight
  temp.style.fontVariantNumeric = style.fontVariantNumeric
  temp.style.width = 'auto'
  temp.style.whiteSpace = 'nowrap'
  temp.style.visibility = 'hidden'
  temp.style.position = 'absolute'

  temp.innerHTML = cell.innerHTML

  document.body.appendChild(temp)

  const originalWidth = temp.offsetWidth

  document.body.removeChild(temp)

  return originalWidth
}

const createColumnSizingState = (
  widths: number[],
  columns: string[],
) => {
  const state = columns.reduce<ColumnSizingState>((acc, key, index) => {
    acc[key] = widths[index]

    return acc
  }, {})

  return state
}

export const getExpandedColumnSizingState = (
  columns: string[],
  wrapperRef: HTMLDivElement | null,
) => {
  const widths: number[] = []

  const table = wrapperRef?.querySelector('table')
  const rows = table?.querySelectorAll('tr')

  rows?.forEach((row) => {
    Array.from(row.children).forEach((cell, index) => {
      const originalWidth = getOriginalCellWidth(cell)
      const savedWidth = widths[index]

      if (savedWidth === undefined || savedWidth < originalWidth) {
        widths[index] = originalWidth
      }
    })
  })

  // перед фиксированными колонками создается дополнительная пуста колонка
  const filteredWidth = widths.filter(Boolean)
  return createColumnSizingState(filteredWidth, columns)
}

