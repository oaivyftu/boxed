import { OutputAreaProps } from "./types";
import "./styles.css"

function OutputArea(props: OutputAreaProps) {
  return (
    <div className="output-container">
      <code>{`[{"id":1,"avatar":"https://robohash.org/minimarerumest.png?size=50x50&set=set1","first_name":"Ezechiel","last_name":"Gosson","email":"egosson0@wikipedia.org","gender":"Male","ip_address":"154.34.211.40"}]`}</code>
    </div>
  )
}

export default OutputArea
