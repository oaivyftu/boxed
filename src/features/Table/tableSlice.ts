import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetUsersParams, User } from "../../app/commonTypes";
import ApiClient from "../../app/ApiClient";

export interface TableState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  data: User[];
  sort: 'asc' | 'desc',
  totalRows: number;
  error?: string;
}

const initialState: TableState = {
  status: "idle",
  data: [],
  totalRows: 0,
  sort: 'asc',
};

export const fetchUsersAsync = createAsyncThunk("table/fetchUsers", async (params: GetUsersParams) => {
  return await ApiClient.getUsers(params)
})

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    sortByFname(state, action: PayloadAction<'asc' | 'desc', string>) {
      const sort = action.payload
      state.sort = sort
      state.data = state.data.sort((a, b) => {
        if (a.first_name < b.first_name) {
          return sort === 'asc' ? -1 : 1
        }
        if (a.first_name > b.first_name) {
          return sort === 'asc' ? 1 : -1
        }
        return 0
      })
    }
  },
  extraReducers: builders => {
    builders
      .addCase(fetchUsersAsync.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchUsersAsync.fulfilled, (state, { payload: { data, count } }) => {
        state.status = 'succeeded'
        state.sort = 'asc'
        state.data = data.sort((a, b) => {
          if (a.first_name < b.first_name) {
            return -1
          }
          if (a.first_name > b.first_name) {
            return 1
          }
          return 0
        })
        state.totalRows = count
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { sortByFname } = tableSlice.actions
export default tableSlice.reducer
