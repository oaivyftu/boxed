import './App.css'
import Table from 'features/Table/Table'
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { User } from "./app/commonTypes"
import { deselectARow, fetchUsersAsync, selectARow, selectCheckedRows } from "./data/users/usersSlice"
import React, { useEffect } from "react"
import { DEFAULT_MAX_RECORDS_PER_PAGE } from "./app/constants"
import { urlParams2Object } from "./app/utils"
import { ColumnsType, TableChangeParams } from "./features/Table/types"
import { TablePaginationConfig } from "./features/Pagination/types"

const columns: ColumnsType<User>[] = [
  {
    title: "ID",
    dataIndex: "id"
  },
  {
    title: "Avatar",
    dataIndex: "avatar",
    render(record): React.ReactNode {
      return <img src={record.avatar} alt="" />
    }
  },
  {
    title: "First name",
    dataIndex: "first_name",
    sorter: true
  },
  {
    title: "Last name",
    dataIndex: "last_name",
    sorter: true
  },
  {
    title: "Email",
    dataIndex: "email"
  },
  {
    title: "Gender",
    dataIndex: "gender"
  },
  {
    title: "IP Address",
    dataIndex: "ip_address",
    sorter: true
  },
]

function App() {
  const query = new URLSearchParams(window.location.search)
  const dispatch = useAppDispatch()
  const tableStatus = useAppSelector(state => state.users.status)
  const users = useAppSelector(state => state.users.data)
  const error = useAppSelector(state => state.users.error)
  const totalRows: number = useAppSelector(state => state.users.totalRows)
  const checkedRows: User[] = useAppSelector(selectCheckedRows)

  useEffect(() => {
    if (tableStatus === 'idle') {
      const query = new URLSearchParams(window.location.search)
      if (!query.get('page')) query.set('page', '1')
      if (!query.get('limit')) query.set('limit', String(DEFAULT_MAX_RECORDS_PER_PAGE))
      dispatch(fetchUsersAsync(urlParams2Object(query)))
      window.history.pushState("", "", `?${query.toString()}`)
    }
  }, [tableStatus, dispatch])

  const onSelectRow = (e: React.ChangeEvent<HTMLInputElement>, user: User) => {
    if (e.target.checked) {
      dispatch(selectARow(user))
    } else {
      dispatch(deselectARow(user))
    }
  }

  const onTableChange = ({ current, search }: TableChangeParams) => {
    if (current) query.set('page', String(current))
    if (search !== undefined) query.set('s', search)

    dispatch(fetchUsersAsync(urlParams2Object(query)))
    window.history.pushState("", "", `?${query.toString()}`)
  }

  const paginationConfig: TablePaginationConfig = {
    total: totalRows,
    current: Number(query.get('page')),
    limit: Number(query.get('limit'))
  }
  
  return (
    <div className="wrapper">
      <Table
        errorMsg={error}
        loading={tableStatus === "loading"}
        dataSource={users}
        columns={columns}
        pagination={paginationConfig}
        onChange={onTableChange}
        rowSelection={{ selectedRows: checkedRows, onSelectRow }}
      />
    </div>
  )
}

export default App
