import { map } from "rxjs/operators";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { Observable } from "rxjs";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { CrudService } from "./../../../../private/firebase/crud.service";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent implements OnInit {
  objectConfig = {} as any;
  options: Observable<any>;
  selected = "";

  data;

  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  @Input() set config(value) {
    this.objectConfig = JSON.parse(value);
  }
  @Input() value;

  @ViewChild(MatAutocomplete, { static: false })
  matAutocomplete: MatAutocomplete;

  constructor(private __g_: CrudService) {}

  ngOnInit() {
    let goin = false;

    if (this.value && this.objectConfig) {
      if (
        this.objectConfig.valueToEmit === Object(this.objectConfig.valueToEmit)
      ) {
        this.objectConfig.valueToSelect = JSON.parse(this.value);
        goin = true;
      } else {
        this.objectConfig.valueToSelect = this.objectConfig.path + this.value;
        goin = true;
      }

      if (goin) {
        this.__g_
          .getDocument(this.objectConfig.valueToSelect)
          .subscribe((item) => {
            if (item) {
              this.selected = item[this.objectConfig["attributeToDisplay"]];
            }
          });
      }
    }
  }

  onChanges(event): void {
    this.options = this.getOptions(event);
  }

  private getOptions(event) {
    if (event.length > 2) {
      var strSearch = event;
      var strlength = strSearch.length;
      var strFrontCode = strSearch.slice(0, strlength - 1);
      var strEndCode = strSearch.slice(strlength - 1, strSearch.length);

      let startcode = event;
      var endcode =
        strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

      let query = {
        ...this.objectConfig.query,
        where: [
          [this.objectConfig.valueToSelect, ">=", startcode],
          [this.objectConfig.valueToSelect, "<", endcode],
        ],
      };

      return this.__g_.get(query);
    }
  }

  select(selected?) {
    let valueToEmit;
    if (
      this.objectConfig.valueToEmit === Object(this.objectConfig.valueToEmit)
    ) {
      valueToEmit = JSON.parse(JSON.stringify(this.objectConfig.valueToEmit));
      Object.keys(valueToEmit).map((key) => {
        if (valueToEmit[key] === "undefined") {
          valueToEmit[key] = selected.value[key];
        }
      });

      let emition = {};
      emition[this.objectConfig.name] = valueToEmit;

      valueToEmit = emition;
    } else {
      valueToEmit = {};
      valueToEmit[this.objectConfig.valueToEmit] =
        selected.value[this.objectConfig["attributeToStore"]];
    }

    this.emit(valueToEmit);
  }

  display = (v: any) => {
    return v[this.objectConfig["attributeToDisplay"]];
  };

  clear() {
    this.selected = "";
    this.options = null;
    this.objectConfig.valueToSelect = JSON.parse(
      JSON.stringify(this.objectConfig.null)
    );
    this.emit(null);
  }

  emit(valueToEmit) {
    this.patch.emit(valueToEmit);

    this.options = null;
  }
}
