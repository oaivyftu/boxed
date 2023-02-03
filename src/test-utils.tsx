import React, { PropsWithChildren, ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import usersReducer from 'data/users/usersSlice'
import { configureStore, PreloadedState } from "@reduxjs/toolkit"
import { RootState } from 'app/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: ReturnType<typeof configureStore>
}

export const initState: PreloadedState<RootState> = {
  users: {
    status: "idle",
    data: [],
    totalRows: 0,
    checkedRows: []
  }
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = initState,
    store = configureStore({ reducer: { users: usersReducer }, preloadedState }),
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
