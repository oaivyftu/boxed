import { SearchInputProps } from "./types";
import "./styles.css"
import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchUsersAsync } from "../Table/tableSlice";

function SearchInput(props: SearchInputProps) {
  const dispatch = useAppDispatch()
  const [search, changeSearch] = useState<string>("")
  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    changeSearch(query.get('s') || "")
  }, [])
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(fetchUsersAsync({
      s: search
    }))
    const url = new URL(window.location.href)
    const query = new URLSearchParams(url.search)
    query.set('s', search)
    url.search = query.toString()
    window.history.pushState("", "", url.toString())
  }
  return (
    <form className="search-container" onSubmit={onSubmitHandler}>
      <input type="text" placeholder="Search by first name.." className="search-ip" value={search} onChange={(e) => changeSearch(e.target.value)} />
      <button className="search-btn">Search</button>
    </form>
  )
}

export default SearchInput
