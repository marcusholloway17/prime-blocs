import { Component } from '@angular/core';
import { LoaderService } from './loader.service';
import { tap } from 'rxjs';

@Component({
  selector: 'primeng-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  public blockedDocument: boolean = false;
  public loaderState$ = this.loaderService.performingAction$.pipe(
    tap((state) => (this.blockedDocument = state))
  );
  constructor(private loaderService: LoaderService) {}
}
