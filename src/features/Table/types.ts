import { TablePaginationConfig } from "features/Pagination/types"
import React, { ReactNode } from "react"

export interface ColumnsType<T> {
  title: string;
  dataIndex: keyof T;
  sorter?: boolean;
  render?(record: T): ReactNode
}

export interface TableChangeParams {
  current?: number;
  search?: string;
}

export interface TableRowSelection<T> {
  selectedRows: T[];
  onSelectRow(e: React.ChangeEvent<HTMLInputElement>, record: T): void;
}

export interface TableProps<RecordType> {
  locale?: string;
  dataSource: RecordType[];
  columns: ColumnsType<RecordType>[];
  loading?: boolean;
  errorMsg?: string;
  tableClassName?: string;
  pagination?: TablePaginationConfig;
  rowSelection?: TableRowSelection<RecordType>;
  onChange?(params: TableChangeParams): void;
}
