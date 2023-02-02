import React, { PropsWithChildren, ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import tableReducer from 'features/Table/tableSlice'
import { configureStore, PreloadedState } from "@reduxjs/toolkit"
import { RootState } from 'app/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: ReturnType<typeof configureStore>
}

export const initState: PreloadedState<RootState> = {
  table: {
    status: "idle",
    data: [],
    totalRows: 0,
    sort: 'asc',
    checkedRows: []
  }
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = initState,
    store = configureStore({ reducer: { table: tableReducer }, preloadedState }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'
export { renderWithProviders as render }
