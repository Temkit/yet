import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-customEmit',
  templateUrl: './customEmit.component.html',
  styleUrls: ['./customEmit.component.css']
})
export class CustomEmitComponent implements OnInit {

  formControl = new FormControl('');
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  element;
  valueToDisplay;
  data;


  constructor() { }

  ngOnInit() {
    this.valueToDisplay = of(this.data);
    this.formControl.valueChanges.subscribe(data => {
      data;
      const obj = JSON.parse(JSON.stringify(this.element.valueToEmit));

      Object.keys(obj).map(key => {
        if (obj[key] === 'undefined') {
          obj[key] = data;
        }
      });

      let tmp = {};

      tmp[this.element.name] = obj;


      this.patch.emit(tmp);
    });
  }

  @Input()
  set config(val) {
    if (val) {
      this.element = JSON.parse(val);
    }
  }


  @Input()
  set value(val) {
    if (val) {
      this.data = JSON.parse(val);
      this.formControl.patchValue(this.data[this.element.valueToDisplay]);
    }
  }

}
