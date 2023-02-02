import React from 'react';
import { render, screen, within } from 'test-utils';
import userEvent from '@testing-library/user-event';
import Table from '../Table'
import ApiClient, { UsersController } from "app/ApiClient";
import { GetUsersParams } from "../../../app/commonTypes";
import { DEFAULT_MAX_RECORDS_PER_PAGE } from "../../../app/constants";
import mockUsers from './mockUsers.json'

async function mockGetUsers(params: GetUsersParams) {
  const UsersControllerInstance = new UsersController(mockUsers)
  const { data, count } = UsersControllerInstance.getUsers(params)
  return { data, count }
}

describe("Table component", () => {
  beforeEach(() => {
    jest.spyOn(ApiClient, "getUsers").mockImplementation(mockGetUsers)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    window.history.pushState(null, "", "/")
  });

  it('fetches & receives users when loaded', async () => {
    render(<Table />, {})

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)
  });

  it('should be able to search and display user results', async () => {
    render(<Table />)

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)

    await userEvent.type(screen.getByTestId("search-ip"), "levy")
    await userEvent.click(screen.getByRole("button", { name: /search/i }))
    const userRecords = screen.getAllByTestId("user-record")
    expect(userRecords).toHaveLength(1)
  })

  it('should be able to navigate between result pages', async () => {
    render(<Table />)

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)
    expect(screen.getAllByRole("button", { name: /\d/ })).toHaveLength(5)
    expect(screen.getByRole("button", { name: /</ })).toBeDisabled()

    expect(screen.getByRole("button", { name: /1/ })).toHaveClass("page-btn-active")
    await userEvent.click(screen.getByRole("button", { name: />/ }))
    expect(screen.getByRole("button", { name: /2/ })).toHaveClass("page-btn-active")
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)

    await userEvent.click(screen.getByRole("button", { name: /5/ }))
    expect(screen.getByRole("button", { name: />/ })).toBeDisabled()
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)

    await userEvent.click(screen.getByRole("button", { name: /</ }))
    expect(screen.getByRole("button", { name: /4/ })).toHaveClass("page-btn-active")
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)
  })

  it('should be able to show results based on url params', async function () {
    const query = new URLSearchParams()
    query.set('limit', '10')
    query.set('page', '2')
    window.history.pushState(null, "", `?${query.toString()}`)

    render(<Table />)

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findAllByTestId("user-record")).toHaveLength(10)
    expect(screen.getAllByRole("button", { name: /\d/ })).toHaveLength(2)
    expect(screen.getByRole("button", { name: /2/ })).toHaveClass("page-btn-active")
  });

  it('should be able to show no data when url params are inappropriate', async () => {
    const query = new URLSearchParams()
    query.set('s', 'abcd')
    window.history.pushState(null, "", `?${query.toString()}`)

    render(<Table />)

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findByText(/No data/i)).toBeInTheDocument()
  })

  it('should be able to show selected rows as JSON below', async () => {
    render(<Table />)

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)

    await userEvent.click(screen.getByTestId("cbox-2"))
    await userEvent.click(screen.getByTestId("cbox-1"))
    await userEvent.click(screen.getByTestId("cbox-3"))
    await userEvent.click(screen.getByTestId("cbox-3"))

    expect(screen.getByTestId('op-container')).toHaveTextContent("[{\"id\":2,\"avatar\":\"https://robohash.org/errordoloribuseveniet.png?size=50x50&set=set1\",\"first_name\":\"Alberik\",\"last_name\":\"Howett\",\"email\":\"ahowett1@geocities.jp\",\"gender\":\"Genderqueer\",\"ip_address\":\"131.131.92.227\"},{\"id\":1,\"avatar\":\"https://robohash.org/minimarerumest.png?size=50x50&set=set1\",\"first_name\":\"Ezechiel\",\"last_name\":\"Gosson\",\"email\":\"egosson0@wikipedia.org\",\"gender\":\"Male\",\"ip_address\":\"154.34.211.40\"}]")
  })

  it('should be able to show user results ascending by default', async () => {
    render(<Table />)

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)

    const rows = screen.getAllByTestId("user-record")
    expect(within(rows[0]).getByText(/Alberik/i)).toBeInTheDocument()
    expect(within(rows[1]).getByText(/Ezechiel/i)).toBeInTheDocument()
    expect(within(rows[2]).getByText(/Levy/i)).toBeInTheDocument()
    expect(within(rows[3]).getByText(/Othilia/i)).toBeInTheDocument()
  })

  it('should be able to show user results descending once user clicks on the "First Name" column header', async () => {
    render(<Table />)

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findAllByTestId("user-record")).toHaveLength(DEFAULT_MAX_RECORDS_PER_PAGE)

    await userEvent.click(screen.getByRole('columnheader', { name: /First Name ⇧/i }))

    expect(screen.getByRole('columnheader', { name: /First Name ⇩/i })).toBeInTheDocument()

    const rows = screen.getAllByTestId("user-record")
    expect(within(rows[0]).getByText(/Othilia/i)).toBeInTheDocument()
    expect(within(rows[1]).getByText(/Levy/i)).toBeInTheDocument()
    expect(within(rows[2]).getByText(/Ezechiel/i)).toBeInTheDocument()
    expect(within(rows[3]).getByText(/Alberik/i)).toBeInTheDocument()
  })
})
