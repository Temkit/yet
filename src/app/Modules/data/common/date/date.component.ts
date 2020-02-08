import { Component, Output, EventEmitter, Input } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import * as moment from "moment";

@Component({
  selector: "app-date",
  templateUrl: "./date.component.html",
  styleUrls: ["./date.component.css"]
})
export class DateComponent {
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  objectConfig;
  valueToDisplay = new FormControl({ value: "", disabled: false });

  constructor() {}

  update(event) {
    const obj = {};
    obj[this.objectConfig.name] = new Date(event.value).valueOf();
    this.patch.emit(obj);
  }

  @Input()
  set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
      if (this.objectConfig.disabled) {
        this.valueToDisplay.disable();
      }
    }
  }

  @Input()
  set value(val) {
    if (val) {
      // tslint:disable-next-line:radix
      this.valueToDisplay.setValue(new Date(val));
    }
  }
}
