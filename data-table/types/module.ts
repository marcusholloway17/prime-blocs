import { InjectionToken, Pipe } from '@angular/core';

export enum DataTableSizes {
  'sm',
  'md',
  'lg',
}

export enum DataTableSelectionMode {
  'single',
  'multiple',
}

export type DataTableConfig = {
  pageLabel?: string;
  pageSizeLabel?: string;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  totalItemLabel?: string;
  tableSize?: DataTableSizes | string;
  selectionMode?: DataTableSelectionMode | string;
};

export type DataResponseType = {
  total: number;
  data: any[];
};

export type GridColumnType = {
  title: string;
  label: string;
  transform?: (value: any) => string | Pipe | string;
  type?: string;
};

export type GridConfigType = {
  page: number;
  pageSize: number;
  pageSizeOptions: any[];
  totalItemLabel: string;
  selectionMode: string | DataTableSelectionMode;
  sortable?: boolean;
  checkboxSelection?: boolean;
  radioButtonSelection?: boolean;
  globalFilterFields?: string[];
  gridSize: DataTableSizes | string;
  dataKey: string;
};

export type _QueryParamsType = {
  include?: string[] | object[];
  where?: object;
  attributes?: string[] | { exclude: string[] } | any;
  order?: string[][];
  group?: string;
};

export type QueryParamsType = {
  _query: _QueryParamsType;
  page: number;
  pageSize: number;
};

export const DATA_TABLE_CONFIG_PROVIDER = new InjectionToken<DataTableConfig>(
  'Data Table Config Provider'
);
