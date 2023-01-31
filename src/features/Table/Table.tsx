import { TableProps } from './types'
import React, { ReactNode, useEffect } from "react";
import './styles.css'
import SearchInput from "../SearchInput/SearchInput";
import Pagination from "../Pagination/Pagination";
import OutputArea from "../OutputArea/OutputArea";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsersAsync, sortByFname } from "./tableSlice";
import { User } from "../../app/commonTypes";
import { urlParams2Object } from "../../app/utils";

function Table(props: TableProps) {
  const dispatch = useAppDispatch()
  const tableStatus = useAppSelector(state => state.table.status)
  const users = useAppSelector(state => state.table.data)
  const error = useAppSelector(state => state.table.error)
  const sort = useAppSelector(state => state.table.sort)

  useEffect(() => {
    if (tableStatus === 'idle') {
      const query = new URLSearchParams(window.location.search)
      if (!query.get('page')) query.set('page', '1')
      dispatch(fetchUsersAsync(urlParams2Object(query)))
      window.history.pushState("", "", `?${query.toString()}`)
    }
  }, [tableStatus, dispatch])

  const table: ReactNode = (
    <table className="table-main">
      <thead>
      <tr>
        <th></th>
        <th>ID</th>
        <th>Avatar</th>
        <th className="th-sortable" onClick={() => dispatch(sortByFname(sort === 'asc' ? 'desc' : 'asc'))}>First Name {sort === 'asc' ? "⇧" : "⇩"}</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Gender</th>
        <th>IP Address</th>
      </tr>
      </thead>
      <tbody>
        {tableStatus === 'loading' && "Loading..."}
        {tableStatus === 'failed' && <div>{error}</div>}
        {tableStatus === 'succeeded' && (
          <>
            {users.length === 0 && "No data"}
            {users.map(({ id, email, avatar, gender, first_name, last_name, ip_address }: User) => (
              <tr className="table-row" key={id}>
                <td><input type="checkbox" /></td>
                <td>{id}</td>
                <td><img src={avatar} alt="" /></td>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{email}</td>
                <td>{gender}</td>
                <td>{ip_address}</td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  )

  const pagination = users.length ? <Pagination /> : null

  return (
    <div className="table-container">
      <SearchInput />
      {table}
      {pagination}
      <OutputArea />
    </div>
  )
}

export default Table
