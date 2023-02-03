import { FormEvent, useEffect, useState } from "react"
import { SearchInputProps } from "./types"
import "./styles.css"

function SearchInput({ onChange }: SearchInputProps) {
  const [search, changeSearch] = useState<string>("")
  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    changeSearch(query.get('s') || "")
  }, [])
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    onChange(search)
  }
  return (
    <form className="search-container" onSubmit={onSubmitHandler}>
      <input type="text" data-testid="search-ip" placeholder="Search by first name.." className="search-ip" value={search} onChange={(e) => changeSearch(e.target.value)} />
      <button className="search-btn">Search</button>
    </form>
  )
}

export default SearchInput
