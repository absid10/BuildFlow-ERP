import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataTableProps<T> extends TableProps<T> {
  // Add custom props here if needed, like pagination handling logic.
}

function DataTable<T extends object>(props: DataTableProps<T>) {
  return <Table<T> {...props} />;
}

export default DataTable;
