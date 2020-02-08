import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { map } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { FormControl } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { BEorCONTQuery } from "src/app/private/interfaces/crud";
import { QueryService } from "src/app/private/crud/query.service";
import { OneService } from "src/app/private/crud/one.service";
import { DeleteService } from "src/app/private/crud/delete.service";

@Component({
  selector: "app-autocompletetagsinput",
  templateUrl: "./autocompleteTagsInput.component.html",
  styleUrls: ["./autocompleteTagsInput.component.css"]
})
export class AutocompleteTagsInputComponent implements OnInit {
  _valuetoDisplay: any[] = [];
  _valueToEmit: any[] = [];

  objectConfig = {} as any;

  request = {} as BEorCONTQuery;
  options;

  valueToEmit = {};
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  _tagInput;
  _list;
  _input;

  constructor(private __q_: QueryService, private __o_: OneService) {}

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  itemCtrl = new FormControl();

  @ViewChild("itemInput", { static: false }) itemInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  onChanges(event): void {
    this.options = this.getOptions(event);
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || "").trim()) {
        this._valuetoDisplay.push(value.trim());
      }

      if (input) {
        input.value = "";
      }

      this.itemCtrl.setValue(null);
    }
  }

  remove(item): void {
    let index = this._valuetoDisplay.indexOf(item);

    if (index >= 0) {
      this._valuetoDisplay.splice(index, 1);
    }

    index = this._valueToEmit.indexOf(item[this.objectConfig.attributeToStore]);

    if (index >= 0) {
      this._valueToEmit.splice(index, 1);
    }
    this.emit();
  }

  selected(event): void {
    if (!this._valuetoDisplay.includes(event.value)) {
      this._valuetoDisplay.push(event.value);
    }

    if (
      this._valueToEmit &&
      !this._valueToEmit.includes(
        event.value[this.objectConfig.attributeToStore]
      )
    ) {
      this._valueToEmit.push(event.value[this.objectConfig.attributeToStore]);
    }

    this.itemInput.nativeElement.value = "";
    this.itemCtrl.setValue(null);

    this.emit();
  }

  displayFn(option: any): string | undefined {
    return option ? option.name : undefined;
  }

  getOptions(event) {
    if (event.length > 1) {
      const ExpressionAttributeValues = JSON.parse(
        JSON.stringify(this.objectConfig.ExpressionAttributeValues)
      );
      Object.keys(ExpressionAttributeValues).map(key => {
        if (
          ExpressionAttributeValues &&
          ExpressionAttributeValues[key] == "undefined"
        ) {
          ExpressionAttributeValues[key] = event;
        }
      });

      return (this.options = this.__q_
        .query$(
          "query",
          this.objectConfig.TableName,
          this.objectConfig.IndexName,
          this.objectConfig.KeyConditionExpression,
          this.objectConfig.ProjectionExpression,
          this.objectConfig.FilterExpression,
          this.objectConfig.ExpressionAttributeNames,
          {},
          ExpressionAttributeValues,
          this.objectConfig.Limit,
          null,
          true,
          this.objectConfig.Region,
          false
        )
        .pipe(
          map((options: any) => {
            return options.Items;
          })
        ));
    }
  }
  /*
       select(selected?) {
        this._valuetoDisplay.push(selected);
        if (!this._valueToEmit.includes(selected._id)) {
          this._valueToEmit.push(selected._id);
        }
  
        this.clear();
      }
  
    delete(e) {
      const val = e.srcElement.parentNode.textContent.trim();
      this._valuetoDisplay.splice(this._valuetoDisplay.indexOf(val), 1);
      this.emit();
    }*/

  emit() {
    this.valueToEmit[this.objectConfig.keyStore] = this._valueToEmit;

    this.options = null;
    this.patch.emit(this.valueToEmit);
  }

  /*   clear() {
      this.selected = '';
      this.options = null;
      this.emit();
    } */

  @Input()
  set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
    }
  }

  @Input()
  set value(val) {
    if (val && this.objectConfig && this.objectConfig.valueToSelect) {
      const tmpValues = [];
      this.objectConfig.valueToSelect.map(item => {
        this._valueToEmit.push(item);

        const obj = JSON.parse(JSON.stringify(this.objectConfig.null));

        Object.keys(obj).map(k => {
          if (obj[k] === "undefined") {
            obj[k] = item;
          }
        });

        tmpValues.push(
          this.__o_
            .one$(this.objectConfig.TableName, obj, this.objectConfig.Region)
            .pipe(
              map((data: any) => {
                if (data === undefined) {
                  // console.log(data);
                } else {
                  return data;
                }
              })
            )
        );
      });

      forkJoin(tmpValues).subscribe((data: any) => {
        data.map(d => {
          if (d) {
            // console.log(d);
            this._valuetoDisplay.push(d);
          }
        });
      });
    } else {
      this._valuetoDisplay = [];
    }
  }

  ngOnInit() {}
}
