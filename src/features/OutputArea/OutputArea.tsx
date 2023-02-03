import "./styles.css"
import { useAppSelector } from "app/hooks"
import { User } from "app/commonTypes"
import { selectCheckedRows } from "data/users/usersSlice"
import { OutputAreaProps } from "./types"

function OutputArea(props: OutputAreaProps) {
  const checkedRows: User[] = useAppSelector(selectCheckedRows)
  if (!checkedRows.length) return null
  return (
    <div className="output-container">
      <code data-testid="op-container">{JSON.stringify(checkedRows)}</code>
    </div>
  )
}

export default OutputArea
