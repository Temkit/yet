import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { QueryService } from "src/app/private/crud/query.service";
import { map } from "rxjs/operators";
import { OneService } from "src/app/private/crud/one.service";
import { of } from "rxjs";

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.css"]
})
export class SelectComponent implements OnInit {
  objectConfig = {} as any;
  options;
  selected = [];
  valueToEmit;

  selectedList;
  selectedItem;

  @Input() set value(val) {
    if (val) {
      this.selectedList = JSON.parse(val);
      this.selectedItem = JSON.parse(val);
    }
  }

  @Input() set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
    }
  }

  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  constructor(private __q_: QueryService, private __o_: OneService) {}

  ngOnInit() {
    if (
      this.objectConfig.select === "multiple" ||
      this.objectConfig.selectType === "multiple"
    ) {
      this.options = this.__q_
        .query$(
          "query",
          this.objectConfig.options.TableName,
          this.objectConfig.options.IndexName,
          this.objectConfig.options.KeyConditionExpression,
          this.objectConfig.options.ProjectionExpression,
          this.objectConfig.options.FilterExpression,
          this.objectConfig.options.ExpressionAttributeNames,
          this.objectConfig.options.ExpressionAttributeNames_Additional,
          this.objectConfig.options.ExpressionAttributeValues,
          this.objectConfig.options.Limit,
          null,
          true,
          this.objectConfig.options.Region,
          true
        )
        .pipe(
          map((options: any) => {
            return options.Items;
          })
        );
    } else if (this.objectConfig.select === "config") {
      this.options = this.__o_
        .one$(
          this.objectConfig.TableName,
          this.objectConfig.key,
          this.objectConfig.Region,
          this.objectConfig.AttributesToGet
        )
        .pipe(
          map(data => {
            return data[this.objectConfig.name];
          })
        );
    } else {
      this.options = of(this.objectConfig.options);
    }
  }

  selectItem() {
    if (this.objectConfig.selectType === "multiple") {
      Object.keys(this.objectConfig.valueToEmit).map(key => {
        if (this.objectConfig.valueToEmit[key] === "undefined") {
          this.objectConfig.valueToEmit[key] = this.selectedItem[key];
        }
      });

      this.emit(this.objectConfig.valueToEmit);
    } else {
      this.emit(this.selectedItem);
    }
  }

  selectList() {
    if (this.selectedList.value.length > 0) {
      this.selectedList.value.map(item => {
        if (!this.selected.includes(item[this.objectConfig.attributeToStore])) {
          this.selected.push(item[this.objectConfig.attributeToStore]);
        }
      });
    }

    this.emit(this.selected);
  }

  clear() {
    this.selected = [];
    this.options = null;
    this.emit(null);
  }

  emit(obj) {
    let ObjtoEmit = {};
    ObjtoEmit[this.objectConfig.name] = obj;

    this.patch.emit(ObjtoEmit);
  }

  compareByValue = (f1: any, f2: any) => {
    if (this.objectConfig.attributeToCompare) {
      return (
        f1[this.objectConfig.attributeToCompare] ===
        f2[this.objectConfig.attributeToCompare]
      );
    } else {
      return (
        f1 &&
        this.objectConfig.attributeToDisplay &&
        f2 &&
        f1[this.objectConfig.attributeToDisplay] === f2
      );
    }
  };
}
