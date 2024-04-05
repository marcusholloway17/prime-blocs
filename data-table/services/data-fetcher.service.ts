import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  DATA_TABLE_CONFIG_PROVIDER,
  DataResponseType,
  DataTableConfig,
  QueryParamsType,
} from '../types';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class DataFetcherService {
  private url!: string;

  // query
  public queryParams: QueryParamsType = {
    _query: { order: [['createdAt', 'DESC']] },
    page: 1,
    pageSize: 10,
  };

  // data handler
  private _data$ = new BehaviorSubject<DataResponseType>({
    total: 0,
    data: [],
  });
  public data$ = this._data$.asObservable();

  // loading state
  private _loadingState$ = new BehaviorSubject<{ list: boolean }>({
    list: false,
  });
  public loadingState$ = this._loadingState$.asObservable();

  constructor(
    private httpClient: HttpClient,
    @Inject(DATA_TABLE_CONFIG_PROVIDER) private dataTableConfig: DataTableConfig
  ) {}

  // set url value
  setUrl(value: string) {
    this.url = value;
    return this;
  }

  // set query params value
  setQueryParams(value: QueryParamsType) {
    this.queryParams = value;
    return this;
  }

  // handle loading state
  private setLoadingState(state: Partial<{ list: boolean }>) {
    this._loadingState$.next({ ...this._loadingState$.getValue(), ...state });
  }

  // handle pagination state
  setPaginationState(page: number, pageSize: number) {
    this.queryParams.page = page;
    this.queryParams.pageSize = pageSize;
  }

  // list
  public list(queryParams: QueryParamsType = this.queryParams) {
    this.setLoadingState({ list: true });
    return this.httpClient
      .get<DataResponseType>(
        this.url +
          `?${this.dataTableConfig.pageLabel}=${queryParams?.page}&${this.dataTableConfig.pageSizeLabel}=${queryParams?.pageSize}`,
        {
          params: {
            _query: JSON.stringify(queryParams._query),
          },
        }
      )
      .pipe(
        catchError((err) => {
          this.setLoadingState({ list: false });
          return throwError(() => err);
        }),
        tap((response) => {
          this._data$.next(response);
          this.setLoadingState({ list: false });
        })
      );
  }
}
