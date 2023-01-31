export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
}

export interface GetUsersParams {
  s?: string;
  page?: number;
  limit?: number;
}