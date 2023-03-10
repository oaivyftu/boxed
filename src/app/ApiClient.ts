import { GetUsersParams, User } from "./commonTypes"
import mockUsers from './mockData.json'
import { DEFAULT_MAX_RECORDS_PER_PAGE } from "./constants"

export class UsersController {
  private readonly mockUsers: User[] = []
  constructor(data: User[]) {
    this.mockUsers = [...data]
  }
  getUsers({ s, page, limit = DEFAULT_MAX_RECORDS_PER_PAGE }: GetUsersParams): { data: User[], count: number } {
    let result: User[] = [...this.mockUsers]
    let count = result.length
    if (s) {
      result = this.mockUsers.filter(user => user.first_name.toLowerCase().includes(s.toLowerCase()))
      count = result.length
    }
    if (page) {
      const offset = (page-1)*limit
      result = result.slice(offset, offset + limit)
    } else if (limit)  {
      result = result.slice(0, limit)
    }
    return {
      data: result,
      count
    }
  }
}

class ApiClient {
  public getUsers(params: GetUsersParams): Promise<{data: User[]; count: number}> {
    const UsersControllerInstance = new UsersController(mockUsers)
    const { data, count } = UsersControllerInstance.getUsers(params)
    return new Promise((resolve) => setTimeout(resolve, 1000, { data, count } ))
  }
}

const ApiClientInstance = new ApiClient()
export default ApiClientInstance
