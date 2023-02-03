import { ColumnsType, TableProps } from './types'
import React, { ReactNode, useMemo, useState } from "react"
import './styles.css'
import SearchInput from "features/SearchInput/SearchInput"
import Pagination from "features/Pagination/Pagination"
import OutputArea from "features/OutputArea/OutputArea"
import { SorterResult, SortingDirection } from "app/commonTypes"

function Table<RecordType extends { id: number | string }>({ locale = "en", columns, loading, errorMsg, pagination, rowSelection, tableClassName, dataSource, onChange }: TableProps<RecordType>) {
  const [sortConfig, setSortConfig] = useState<SorterResult<RecordType>>()
  const loadingComp = loading && <tr><td colSpan={8}>Loading...</td></tr>

  const sortedItems = useMemo(() => {
    const sortableItems = [...dataSource]
    if (sortConfig) {
      const IntlInstance = new Intl.Collator(locale, { numeric: true, sensitivity: "base" })
      if (sortConfig.order === 'ASC') {
        return sortableItems.sort((a: RecordType, b: RecordType) => IntlInstance.compare(String(a[sortConfig.field]), String(b[sortConfig.field])))
      }
      if (sortConfig.order === 'DESC') {
        return sortableItems.sort((a: RecordType, b: RecordType) => IntlInstance.compare(String(b[sortConfig.field]), String(a[sortConfig.field])))
      }
    }
    return sortableItems
  }, [dataSource, locale, sortConfig])

  const requestSort = (field: keyof RecordType) => {
    let order: SortingDirection = 'ASC'
    if (sortConfig?.field === field) {
      if (sortConfig.order === 'ASC') {
        order = 'DESC'
      }
      if (sortConfig.order === 'DESC') {
        order = false
      }
    }

    setSortConfig({ field, order })
  }

  const getSymbolFor = (field: keyof RecordType): string => {
    let symbol = "↕"
    if (sortConfig?.field === field) {
      if (sortConfig.order === 'ASC') {
        symbol = "↑"
      }
      if (sortConfig.order === 'DESC') {
        symbol = "↓"
      }
    }

    return symbol
  }

  const columnSet = (
    <>
      {rowSelection && <th></th>}
      {columns.map(({ sorter, title, dataIndex: field }) => {
        let bulk = {}
        if (sorter) {
          bulk = {
            className: "th-sortable",
            onClick: () => requestSort(field)
          }
        }
        return <th key={String(field)} {...bulk}>{title} {sorter ? getSymbolFor(field) : ""}</th>
      })}
    </>
  )

  const renderRowSet = () => {
    if (errorMsg) return (
      <tr>
        <td colSpan={8}>{errorMsg}</td>
      </tr>
    )
    if (!dataSource.length) return (
      <tr>
        <td colSpan={8}>No data</td>
      </tr>
    )
    return sortedItems.map((row) => {
      const renderTd = ({ dataIndex, render }: ColumnsType<RecordType>) => {
        if (render) {
          return <td key={String(dataIndex)}>{render(row)}</td>
        }
        return <td key={String(dataIndex)}>{String(row[dataIndex])}</td>
      }

      let cboxTd: ReactNode = null
      if (rowSelection) {
        const { selectedRows, onSelectRow } = rowSelection
        cboxTd = <td><input type="checkbox" data-testid={`cbox-${row.id}`} checked={selectedRows.findIndex(ckRow => ckRow.id === row.id) !== -1} onChange={e => onSelectRow(e, row)} /></td>
      }

      return (
        <tr className="table-row" data-testid="user-record" key={row.id}>
          {cboxTd}
          {columns.map(renderTd)}
        </tr>
      )
    })
  }

  const table: ReactNode = (
    <table className={`table-main ${tableClassName || ""}`}>
      <thead>
      <tr>
        {columnSet}
      </tr>
      </thead>
      <tbody>
      {loadingComp}
      {!loading && renderRowSet()}
      </tbody>
    </table>
  )

  const onPaginationChange = (current: number) => onChange?.({ current })
  const paginationSet = dataSource.length > 0 && pagination && <Pagination {...pagination} onChange={onPaginationChange} />

  const onSearchChange = (search: string) => onChange?.({ search, current: 1 })

  return (
    <div className="table-container">
      <SearchInput onChange={onSearchChange} />
      {table}
      {paginationSet}
      <OutputArea />
    </div>
  )
}

export default Table
