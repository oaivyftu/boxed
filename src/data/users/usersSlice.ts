import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetUsersParams, SorterResult, User } from "app/commonTypes"
import ApiClient from "app/ApiClient"
import { RootState } from "app/store"

export interface UsersState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  data: User[];
  sorter?: SorterResult<User>;
  totalRows: number;
  checkedRows: User[];
  error?: string;
}

const initialState: UsersState = {
  status: "idle",
  data: [],
  totalRows: 0,
  checkedRows: []
}

export const fetchUsersAsync = createAsyncThunk("users/fetchUsers", async (params: GetUsersParams) => {
  return await ApiClient.getUsers(params)
})

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    selectARow(state, action: PayloadAction<User, string>) {
      state.checkedRows.push(action.payload)
    },
    deselectARow(state, action: PayloadAction<User, string>) {
      state.checkedRows = state.checkedRows.filter((row: User) => row.id !== action.payload.id)
    },
  },
  extraReducers: builders => {
    builders
      .addCase(fetchUsersAsync.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchUsersAsync.fulfilled, (state, { payload: { data, count } }) => {
        state.status = 'succeeded'
        state.data = data
        state.totalRows = count
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { selectARow, deselectARow } = usersSlice.actions
export const selectCheckedRows = (state: RootState) => state.users.checkedRows
export default usersSlice.reducer
