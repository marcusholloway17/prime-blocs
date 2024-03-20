import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _performingAction$ = new BehaviorSubject<boolean>(false);
  public performingAction$ = this._performingAction$.asObservable();

  constructor() {}

  load(performingAction: boolean = true) {
    this._performingAction$.next(performingAction);
  }
}
