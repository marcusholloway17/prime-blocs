import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DATA_TABLE_CONFIG_PROVIDER, DataTableConfig } from './types';
import { DataTableBasicComponent } from './components/data-table-basic/data-table-basic.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [DataTableBasicComponent],
  imports: [
    CommonModule,
    TableModule,
    TranslateModule,
    PaginatorModule,
    InputTextModule,
  ],
  exports: [DataTableBasicComponent],
})
export class DataTableModule {
  public static forRoot(
    config: DataTableConfig
  ): ModuleWithProviders<DataTableModule> {
    return {
      ngModule: DataTableModule,
      providers: [
        {
          provide: DATA_TABLE_CONFIG_PROVIDER,
          useValue: config,
        },
      ],
    };
  }
}
