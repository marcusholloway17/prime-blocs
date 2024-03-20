import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, switchMap, tap, throwError } from 'rxjs';
import {
  CrudLoadingState,
  DataResponseType,
  QueryParamsType,
  badRequestErrorType,
} from '../type';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { LanguageService } from 'src/app/helpers/language.service';

@Injectable()
export class CrudService {
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
  private _loadingState$ = new BehaviorSubject<CrudLoadingState>({
    create: false,
    list: false,
    update: false,
    delete: false,
  });
  public loadingState$ = this._loadingState$.asObservable();

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private languageService: LanguageService
  ) {}

  // create
  public create(data: any) {
    this.setLoadingState({ create: true });
    return this.httpClient.post(this.url, data).pipe(
      catchError((err) => {
        this.setLoadingState({ create: false });
        return this.handleError(err);
      }),
      tap(() => {
        this.setLoadingState({ create: false });
        this.messageService.add({
          severity: 'success',
          detail: this.languageService.instant('app.strings.request-ok'),
        });
      }),
      switchMap(() => this.list(this.queryParams))
    );
  }

  // list
  public list(queryParams: QueryParamsType = this.queryParams) {
    this.setLoadingState({ list: true });
    return this.httpClient
      .get<DataResponseType>(
        this.url +
          `?page=${queryParams?.page}&pageSize=${queryParams?.pageSize}`,
        {
          params: {
            _query: JSON.stringify(queryParams._query),
          },
        }
      )
      .pipe(
        catchError((err) => {
          this.setLoadingState({ list: false });
          return this.handleError(err);
        }),
        tap((response) => {
          this._data$.next(response);
          this.setLoadingState({ list: false });
        })
      );
  }

  // one
  public one(
    id: string | number,
    queryParams: QueryParamsType = this.queryParams
  ) {
    // this.setLoadingState({ list: true });
    return this.httpClient
      .get(this.url + id, {
        params: { _query: JSON.stringify(queryParams._query) },
      })
      .pipe(
        catchError((err) => {
          // this.setLoadingState({ list: false });
          return this.handleError(err);
        })
        // tap(() => this.setLoadingState({ list: false }))
      );
  }

  // update
  public update(id: string | number, data: any) {
    this.setLoadingState({ update: true });
    return this.httpClient.put(this.url + id, data).pipe(
      catchError((err) => {
        this.setLoadingState({ update: false });
        return this.handleError(err);
      }),
      tap(() => {
        this.setLoadingState({ update: false });
        this.messageService.add({
          severity: 'success',
          detail: this.languageService.instant('app.strings.request-ok'),
        });
      }),
      switchMap(() => this.list(this.queryParams))
    );
  }

  // delete
  public delete(id: string | number) {
    this.setLoadingState({ delete: true });
    return this.httpClient.delete(this.url + id).pipe(
      catchError((err) => {
        this.setLoadingState({ delete: false });
        return this.handleError(err);
      }),
      tap(() => {
        this.setLoadingState({ delete: false });
        this.messageService.add({
          severity: 'success',
          detail: this.languageService.instant('app.strings.request-ok'),
        });
      }),
      switchMap(() => this.list(this.queryParams))
    );
  }

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
  private setLoadingState(state: Partial<CrudLoadingState>) {
    this._loadingState$.next({ ...this._loadingState$.getValue(), ...state });
  }

  // handle pagination state
  setPaginationState(page: number, pageSize: number) {
    this.queryParams.page = page;
    this.queryParams.pageSize = pageSize;
  }

  // handle errors
  private handleError(err: HttpErrorResponse) {
    const _error = err.error;
    if (typeof _error == 'string') {
      this.messageService.add({
        severity: 'error',
        detail: _error,
      });
    } else if (Array.isArray(_error?.errors) && _error?.errors?.length) {
      this.messageService.addAll(
        _error?.errors?.map((err: badRequestErrorType) => {
          return {
            severity: 'warn',
            detail: err?.msg,
            summary: err?.params,
          };
        })
      );
    } else {
      this.messageService.add({
        severity: 'error',
        detail: this.languageService.instant('app.strings.request-error'),
      });
    }
    return throwError(() => err);
  }
}
