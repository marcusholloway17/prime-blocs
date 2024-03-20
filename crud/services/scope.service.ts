import { Inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/views/auth/services/auth.service';
import { AUTH_SERVICE } from 'src/app/views/auth/types';

@Injectable({
  providedIn: 'root',
})
export class ScopeService {
  public scopes: string[] = [];

  constructor(@Inject(AUTH_SERVICE) private authService: AuthService) {
    this.authService.signInState$
      .pipe(
        tap((state) => {
          if (state?.scopes) {
            this.scopes = state?.scopes;
          }
        })
      )
      .subscribe();
  }

  getScopes() {
    return this.scopes;
  }

  /**
   * @description check whether the connected user has this scope
   * @param scope
   * @returns boolean
   */
  has(scope: string) {
    return this.scopes?.includes(scope);
  }
}
