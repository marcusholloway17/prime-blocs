import { Pipe } from "@angular/core";

export type DataResponseType = {
  total: number;
  data: any[];
};

export type badRequestErrorType = {
  msg: string;
  params?: string;
  code?: string;
  location?: string;
};

export type GridColumnType = {
  title: string;
  label: string;
  transform?: (value: any) => string | Pipe | string;
  type?: string;
  filterable?: boolean;
  sortable?: boolean;
};

export type GridConfigType = {
  page: number;
  pageSize: number;
  pageSizeOption: any[];
  totalItemLabel: string;
  selectionMode: "single" | "multiple";
  sortable?: boolean;
  checkboxSelection?: boolean;
  radioButtonSelection?: boolean;
  globalFilter?: boolean;
  globalFilterFields?: string[];
  gridSize: string;
};

export type _QueryParamsType = {
  include?: string[] | object[];
  where?: object;
  attributes?: string[] | { exclude: string[] } | any;
  order?: string[][];
  group?: string;
};

export type CrudLoadingState = {
  create: boolean;
  list: boolean;
  update: boolean;
  delete: boolean;
};

export type QueryParamsType = {
  _query: _QueryParamsType;
  page: number;
  pageSize: number;
};

export type CrudActionType = {
  name: string;
  scopes: string[];
};

export type CrudHook = {
  beforeCreate: (item: any) => any;
  beforeEdit: (item: any) => any;
  beforeSubmit: (item: any) => any;
};
