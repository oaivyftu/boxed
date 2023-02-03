export interface TablePaginationConfig {
  current: number;
  total: number;
  limit?: number;
  defaultLimit?: number;
}

export interface PaginationProps extends TablePaginationConfig {
  onChange(current: number): void;
}
