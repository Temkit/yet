import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-tagsInput',
  templateUrl: './tagsInput.component.html',
  styleUrls: ['./tagsInput.component.css']
})
export class TagsInputComponent {

  objectConfig;
  _value: any[] = [];

  valueToEmit = {};
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  constructor() { }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this._value.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.emit();
  }

  remove(fruit): void {
    const index = this._value.indexOf(fruit);

    if (index >= 0) {
      this._value.splice(index, 1);
    }
    this.emit();
  }

  emit() {
    this.valueToEmit[this.objectConfig.name] = this._value;
    this.patch.emit(this.valueToEmit);
  }

  @Input()
  set config(value) {
    this.objectConfig = JSON.parse(value);
  }

  @Input()
  set value(value) {
    const valueToDisplay = JSON.parse(value);
    if (valueToDisplay) {
      this._value = valueToDisplay;
    } else {
      this._value = [];
    }
  }




}
