import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import {
  DATA_TABLE_CONFIG_PROVIDER,
  DataTableConfig,
  DataTableSelectionMode,
  DataTableSizes,
  GridColumnType,
  GridConfigType,
  QueryParamsType,
} from "../../types";
import { Subject, takeUntil, tap } from "rxjs";
import { DataFetcherService } from "../../services/data-fetcher.service";
import * as _ from "lodash";
import { Table } from "primeng/table";

@Component({
  selector: "prime-data-table-basic",
  templateUrl: "./data-table-basic.component.html",
  styleUrls: ["./data-table-basic.component.css"],
  providers: [DataFetcherService],
})
export class DataTableBasicComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // data
  public data$ = this.dataFetcher$.data$.pipe(takeUntil(this.destroy$));

  // selections
  public selected: any;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  // query params
  private _queryParams: QueryParamsType = {
    page: 1,
    pageSize: 10,
    _query: {},
  };
  public get queryParams() {
    return this._queryParams;
  }
  @Input() set queryParams(value: QueryParamsType) {
    this._queryParams = value;
    this.dataFetcher$.setQueryParams(value);
  }

  // data columns
  @Input() gridColumns: GridColumnType[] = [];

  // data config
  @Input() gridConfig: GridConfigType | Partial<GridConfigType> = {
    page: this.dataTableConfig.page ?? 1,
    pageSize: this.dataTableConfig.pageSize ?? 10,
    pageSizeOptions: this.dataTableConfig.pageSizeOptions ?? [10, 50, 100],
    totalItemLabel: this.dataTableConfig.totalItemLabel ?? "items",
    gridSize: this.dataTableConfig.tableSize ?? DataTableSizes.md,
    selectionMode:
      this.dataTableConfig.selectionMode ?? DataTableSelectionMode.single,
  };

  // url to fetch data
  @Input() set url(value: string) {
    this.dataFetcher$.setUrl(value);
  }

  // loading state
  public loadingState!: { list: boolean };

  // datagrid sizes
  public sizes: any[] = [
    { name: "sm", class: "p-datatable-sm" },
    { name: "md", class: "" },
    { name: "lg", class: "p-datatable-lg" },
  ];

  // templates input
  @Input() rowActionsTemplate!: TemplateRef<unknown>;
  @Input() ActionBarTemplate!: TemplateRef<unknown>;

  constructor(
    @Inject(DATA_TABLE_CONFIG_PROVIDER)
    private dataTableConfig: DataTableConfig,
    private dataFetcher$: DataFetcherService
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.handleLoadingState();
  }

  refresh() {
    this.dataFetcher$
      .list(this.queryParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  handleLoadingState() {
    this.dataFetcher$.loadingState$
      .pipe(
        takeUntil(this.destroy$),
        tap((state) => (this.loadingState = state))
      )
      .subscribe();
  }

  onPageChange(event: any) {
    this.queryParams.page = event?.page + 1;
    this.queryParams.pageSize = event?.rows;
    this.refresh();
  }

  setGridSize(
    size: string | DataTableSizes = this.dataTableConfig.tableSize ?? "md"
  ) {
    return (
      this.sizes.find((s) => s?.name == size)?.class ?? this.sizes[0]?.class
    );
  }

  getProperty(object: any, property: string) {
    return _.get(object, property);
  }

  onGlobalFilter(table: Table, event: any) {
    return table.filterGlobal(
      event?.target?.value ?? event?.value ?? event,
      "contains"
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
