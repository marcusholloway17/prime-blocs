import { Pipe, PipeTransform } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map, take, throwError } from "rxjs";

@Pipe({
  name: "request",
})
export class RequestPipe implements PipeTransform {
  constructor(private http: HttpClient) {}

  transform(
    value: string | number,
    url: string,
    params?: any,
    columns?: string[]
  ): Observable<any> {
    const apiUrl = `${url}${value}`;

    return this.http
      .get(apiUrl, {
        params: !params
          ? {}
          : {
              ...params,
              _query: params?._query ? JSON.stringify(params._query) : {},
            },
      })
      .pipe(
        catchError((err) => {
          // handle error logic

          return throwError(() => err);
        }),
        take(1),
        map((data: any) => {
          if (columns) {
            const values = columns.map((column) => data[column]).join(" ");
            return values;
          } else {
            return data;
          }
        })
      );
  }
}
