import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { CrudService } from "./services/crud.service";
import { Subject, takeUntil, tap } from "rxjs";
import {
  CrudActionType,
  CrudHook,
  GridColumnType,
  GridConfigType,
  QueryParamsType,
} from "./type";
import { Table } from "primeng/table";
import * as _ from "lodash";
import {
  FORM_CLIENT,
  FormsClient,
  ReactiveFormComponentInterface,
} from "@azlabsjs/ngx-smart-form";
import { ScopeService } from "./services/scope.service";
import { ConfirmationService } from "primeng/api";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "prime-crud",
  templateUrl: "./crud.component.html",
  styleUrls: ["./crud.component.css"],
  providers: [CrudService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudComponent implements OnInit, AfterContentInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // datagrid sizes
  public sizes: any[] = [
    { name: "sm", class: "p-datatable-sm" },
    { name: "md", class: "" },
    { name: "lg", class: "p-datatable-lg" },
  ];

  // edit & delete dialogs
  public deleteItemDialog: boolean = false;
  public itemDialog: boolean = false;

  // url to fetch data
  @Input() set url(value: string) {
    this.crudService.setUrl(value);
  }

  // save or update confirm popup handler
  @Input() useConfirmationPopup: boolean = true;

  // CRUD element config
  @Input() dataPrimaryKeyFieldName: string = "id";

  // loading state
  public loadingState$ = this.crudService.loadingState$;

  // data
  public data$ = this.crudService.data$.pipe(takeUntil(this.destroy$));

  // title & description
  @Input() title!: string;
  @Input() description!: string;

  // data config
  @Input() gridConfig: GridConfigType = {
    page: 1,
    pageSize: 10,
    pageSizeOption: [10, 20, 30],
    totalItemLabel: "items",
    gridSize: "sm",
    selectionMode: "single",
  };

  // form config
  @Input() formId: string | number = 0;

  // data columns
  @Input() gridColumns: GridColumnType[] = [];

  // query params
  private _queryParams: QueryParamsType = {
    page: 1,
    pageSize: 10,
    _query: { order: [["createdAt", "ASC"]] },
  };
  public get queryParams() {
    return this._queryParams;
  }
  @Input() set queryParams(value: QueryParamsType) {
    this._queryParams = value;
    this.crudService.setQueryParams(value);
  }

  // actions config
  @Input() public actions?: CrudActionType[] = [
    {
      name: "create",
      scopes: [],
    },
    {
      name: "read",
      scopes: [],
    },
    {
      name: "update",
      scopes: [],
    },
    {
      name: "delete",
      scopes: [],
    },
  ];

  // hooks handler
  @Input() public hooks: CrudHook = {
    beforeEdit: (item) => item,
    beforeCreate: (arg) => arg,
    beforeSubmit: (item) => item,
  };

  // scopes handler
  public scopes = this.scopeService.getScopes();

  // events emitters
  @Output() lazyLoad: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onList: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();

  // selections
  public selected: any;

  // form details
  public form$ = this.formsClient.get(this.formId);
  @ViewChild("form", { static: false })
  formvalue!: ReactiveFormComponentInterface;

  // template input area
  @Input() actionBarTemplate!: TemplateRef<unknown>;
  @Input() rowActionsBarTemplate!: TemplateRef<unknown>;

  constructor(
    private crudService: CrudService,
    private scopeService: ScopeService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    @Inject(FORM_CLIENT) private formsClient: FormsClient
  ) {}

  ngOnInit(): void {
    this.refresh();
    // this.handleLoadingState();
  }

  ngAfterContentInit(): void {
    this.form$ = this.formsClient
      .get(this.formId)
      .pipe(takeUntil(this.destroy$));
  }

  onFilter(event: any) {
    // TODO: make a request with filtered value & fields
    // this.onPageChange({
    //   page: this.queryParams.page - 1,
    //   rows: event?.filters?.golbal?.value?.length
    //     ? this.gridConfig.pageSizeOption[-1]
    //     : this.gridConfig.pageSizeOption[0],
    // });
    // await lastValueFrom(
    //   of(event).pipe(
    //     take(1),
    //     takeUntil(this.destroy$),
    //     debounceTime(500),
    //     distinctUntilChanged(),
    //     switchMap((event) =>
    //       this.crudService.list({
    //         ...this.queryParams,
    //         pageSize: event?.filters?.golbal?.value?.length
    //           ? this.gridConfig.pageSizeOption[-1]
    //           : this.gridConfig.pageSizeOption[0],
    //       })
    //     )
    //   )
    // );
  }

  getProperty(object: any, property: string) {
    return _.get(object, property);
  }

  onPageChange(event: any) {
    this.queryParams.page = event?.page + 1;
    this.queryParams.pageSize = event?.rows;
    this.refresh();
  }

  hideDialog() {
    this.selected = undefined;
    this.itemDialog = false;
  }

  setGridSize(size: string) {
    return (
      this.sizes.find((s) => s?.name == size)?.class ?? this.sizes[0]?.class
    );
  }

  clear(table: Table) {
    table.clear();
  }

  onGlobalFilter(table: Table, event: any) {
    return table.filterGlobal(
      event?.target?.value ?? event?.value ?? event,
      "contains"
    );
  }

  // handleLoadingState() {
  //   this.crudService.loadingState$
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       tap((state) => (this.loadingState = state))
  //     )
  //     .subscribe();
  // }

  refresh() {
    this.crudService
      .list(this.queryParams)
      .pipe(
        takeUntil(this.destroy$),
        tap((response) => this.onList.emit(response))
      )
      .subscribe();
  }

  // form ready state
  onFormReadyState(event: any) {}

  // save item
  saveItem(
    event: Event,
    value: any = this.formvalue?.formGroup?.getRawValue()
  ) {
    this.formvalue?.validateForm();

    if (this.useConfirmationPopup) {
      if (event?.target)
        this.confirmationService.confirm({
          target: event?.target,
          message: this.translateService.instant("app.prompt.proceed"),
          icon: "pi pi-exclamation-triangle",
          acceptLabel: this.translateService.instant("app.strings.yes"),
          rejectLabel: this.translateService.instant("app.strings.no"),
          accept: () => {
            if (this.selected) {
              this.crudService
                .update(
                  this.selected[this.dataPrimaryKeyFieldName],
                  this.hooks.beforeSubmit(value)
                )
                .pipe(
                  takeUntil(this.destroy$),
                  tap((result) => {
                    if (result) {
                      this.onUpdate.emit(value);
                      this.selected = undefined;
                      this.formvalue?.reset();
                    }
                  })
                )
                .subscribe();
            } else {
              this.crudService
                .create(this.hooks.beforeSubmit(value))
                .pipe(
                  takeUntil(this.destroy$),
                  tap((result) => {
                    if (result) {
                      this.onCreate.emit(value);
                      this.selected = undefined;
                      this.formvalue?.reset();
                    }
                  })
                )
                .subscribe();
            }
          },
        });
    } else {
      if (this.selected) {
        this.crudService
          .update(
            this.selected[this.dataPrimaryKeyFieldName],
            this.hooks.beforeSubmit(value)
          )
          .pipe(
            takeUntil(this.destroy$),
            tap((result) => {
              if (result) {
                this.onUpdate.emit(value);
                this.selected = undefined;
                this.formvalue?.reset();
              }
            })
          )
          .subscribe();
      } else {
        this.crudService
          .create(this.hooks.beforeSubmit(value))
          .pipe(
            takeUntil(this.destroy$),
            tap((result) => {
              if (result) {
                this.onCreate.emit(value);
                this.selected = undefined;
                this.formvalue?.reset();
              }
            })
          )
          .subscribe();
      }
    }
  }

  // edit action
  editItem(item: any) {
    this.selected = item;
    this.itemDialog = true;
    // if (this.hooks && Object.hasOwn(this.hooks, 'beforeEdit')) {
    //   item = this.hooks.beforeEdit(item);
    // }
    setTimeout(() => {
      this.formvalue?.setValue(this.hooks.beforeEdit(item));
    }, 100);
  }
  onItemDialogHide() {
    this.selected = undefined;
    this.itemDialog = false;
  }

  // delete action
  deleteItem(item: any) {
    this.selected = item;
    this.deleteItemDialog = true;
  }

  // actions handler
  hasAction(name: string) {
    return this.actions?.find((e) => e.name === name) ? true : false;
  }
  // scopes handler
  hasScope(action: CrudActionType) {
    const findedAction = this.actions?.find((e) => e.name === action.name);
    if (
      findedAction &&
      action.scopes?.length > 0 &&
      findedAction.scopes?.some((scope) => action?.scopes.includes(scope))
    ) {
      return true;
    } else {
      return false;
    }
  }

  getAction(name: string) {
    return this.actions?.find((e) => e.name === name);
  }

  getScopes(actionName: string) {
    return this.actions?.find((e) => e.name === actionName)?.scopes || [];
  }

  isDisabled(actionName: string) {
    const action = this.getAction(actionName);

    return action && action?.scopes?.length > 0
      ? this.scopes.some((scope) =>
          this.getAction(actionName)?.scopes.includes(scope)
        )
        ? false
        : true
      : false;
  }

  confirmDelete() {
    this.crudService
      .delete(this.selected[this.dataPrimaryKeyFieldName])
      .pipe(
        takeUntil(this.destroy$),
        tap((response) => {
          this.onDelete.emit(this.selected[this.dataPrimaryKeyFieldName]);
          this.selected = undefined;
          this.deleteItemDialog = false;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
