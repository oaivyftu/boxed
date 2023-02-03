import { PaginationProps } from "./types"
import "./styles.css"
import { DEFAULT_MAX_RECORDS_PER_PAGE } from "app/constants"

function Pagination({ total, current = 1, limit, defaultLimit = DEFAULT_MAX_RECORDS_PER_PAGE, onChange }: PaginationProps) {
  const pageCount = Math.ceil(total/(limit || defaultLimit))

  const pages = Array(pageCount).fill(null).map((e, idx) => (
    <button key={idx} className={`page-btn ${current === (idx+1) ? "page-btn-active" : ""}`} onClick={() => onChange(idx+1)}>{idx+1}</button>
  ))
  const prevBtn = <button className="page-btn" disabled={current === 1} onClick={() => onChange(current-1)}>&lt;</button>
  const nextBtn = <button className="page-btn" disabled={current === pageCount} onClick={() => onChange(current+1)}>&gt;</button>

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
