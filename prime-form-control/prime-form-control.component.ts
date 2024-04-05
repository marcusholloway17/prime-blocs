import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  InputTypes,
  InputConfigInterface,
  OptionsConfig,
} from "@azlabsjs/smart-form-core";
import { InputTypeHelper } from "./services";

@Component({
  selector: "ngx-prime-form-control",
  templateUrl: "./prime-form-control.component.html",
  styleUrls: ["./prime-form-control.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimeFormControlComponent {
  inputTypes = InputTypes;
  @Input() control!: FormControl<any>;
  @Input() inputconfig!: InputConfigInterface;

  constructor(public readonly inputType: InputTypeHelper) {}

  parseSource(rawSource: string) {
    const optionsArray = rawSource?.split("|");
    return optionsArray?.map((option) => {
      const optionItem = option?.split(":");
      return {
        key: optionItem[0],
        label: optionItem[1],
      };
    });
  }

  toDate(date: string) {
    return new Date(date);
  }

  mapSelectionResource(optionConfig: OptionsConfig) {
    return optionConfig?.source?.raw?.split("|")?.map((e) => {
      return {
        key: e?.split(":")[0],
        value: e?.split(":")[1],
      };
    });
  }
}
