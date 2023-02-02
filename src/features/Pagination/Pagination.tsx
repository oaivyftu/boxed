import { PaginationProps } from "./types"
import "./styles.css"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { DEFAULT_MAX_RECORDS_PER_PAGE } from "app/constants"
import { fetchUsersAsync } from "features/Table/tableSlice"
import { urlParams2Object } from "app/utils"

function Pagination(props: PaginationProps) {
  const dispatch = useAppDispatch()
  const query = new URLSearchParams(window.location.search)
  const curPage: number = Number(query.get('page')) || 1
  const limit = Number(query.get('limit')) || DEFAULT_MAX_RECORDS_PER_PAGE
  const totalRows: number = useAppSelector(state => state.table.totalRows)
  const pageCount = Math.ceil(totalRows/limit)

  const onPageBtnClk = (page: number) => {
    query.set('page', String(page))
    dispatch(fetchUsersAsync(urlParams2Object(query)))

    window.history.pushState("", "", `?${query.toString()}`)
  }

  const pages = Array(pageCount).fill(null).map((e, idx) => (
    <button key={idx} className={`page-btn ${curPage === (idx+1) ? "page-btn-active" : ""}`} onClick={() => onPageBtnClk(idx+1)}>{idx+1}</button>
  ))
  const prevBtn = <button className="page-btn" disabled={curPage === 1} onClick={() => onPageBtnClk(curPage-1)}>&lt;</button>
  const nextBtn = <button className="page-btn" disabled={curPage === pageCount} onClick={() => onPageBtnClk(curPage+1)}>&gt;</button>

  return (
    <div className="pagination-container">
      <div className="page-list">
        {prevBtn}
        {pages}
        {nextBtn}
      </div>
    </div>
  )
}

export default Pagination
