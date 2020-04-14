import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
  selector: "app-picker",
  templateUrl: "./picker.component.html",
  styleUrls: ["./picker.component.css"],
})
export class PickerComponent {
  objectConfig = {} as any;
  color;

  @Input() set config(value) {
    this.objectConfig = JSON.parse(value);
  }

  @Input() set value(val) {
    this.color = val.replace(/\"/g, "");
    console.log(this.color);
  }
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  emit(color) {
    console.log(color);
    this.value = color;
    let valueToEmit = {};
    valueToEmit[this.objectConfig.name] = color;
    this.patch.emit(valueToEmit);
  }
}
