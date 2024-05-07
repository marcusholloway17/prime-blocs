import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "./loader/loader.component";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { BlockUIModule } from "primeng/blockui";
import { CrudComponent } from "./crud/crud.component";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { DialogModule } from "primeng/dialog";
import { NgxSmartFormModule } from "@azlabsjs/ngx-smart-form";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RequestPipe } from "./pipes/request.pipe";
import { SafePipe } from "./pipes/safe.pipe";
import { WithLoadingPipe } from "./pipes/with-loading.pipe";
import { CalendarModule } from "primeng/calendar";
import { PasswordModule } from "primeng/password";
import { InputNumberModule } from "primeng/inputnumber";
import { RadioButtonModule } from "primeng/radiobutton";
import { PrimeFormControlComponent } from "./prime-form-control/prime-form-control.component";
import { EditorModule } from "primeng/editor";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputMaskModule } from "primeng/inputmask";
import { DropdownModule } from "primeng/dropdown";
import { SidebarModule } from "primeng/sidebar";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DataTableModule } from "./data-table/data-table.module";
import { ChartComponent } from "./chart/chart.component";

@NgModule({
  declarations: [
    LoaderComponent,
    CrudComponent,
    RequestPipe,
    WithLoadingPipe,
    SafePipe,
    PrimeFormControlComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    BlockUIModule,
    ToolbarModule,
    TableModule,
    ButtonModule,
    TranslateModule,
    InputTextModule,
    PaginatorModule,
    DialogModule,
    NgxSmartFormModule,
    CalendarModule,
    PasswordModule,
    InputNumberModule,
    RadioButtonModule,
    EditorModule,
    InputTextareaModule,
    InputMaskModule,
    DropdownModule,
    SidebarModule,
    DividerModule,
    TooltipModule,
    ConfirmPopupModule,
    DataTableModule,
  ],
  exports: [
    LoaderComponent,
    PrimeFormControlComponent,
    CrudComponent,
    RequestPipe,
    WithLoadingPipe,
    SafePipe,
    DataTableModule,
    ChartComponent,
  ],
})
export class BlocsModule {}
