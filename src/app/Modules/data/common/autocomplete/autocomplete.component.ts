import { map } from "rxjs/operators";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { Observable } from "rxjs";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { QueryService } from "src/app/private/crud/query.service";
import { OneService } from "src/app/private/crud/one.service";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"]
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

  constructor(private __q_: QueryService, private __o_: OneService) {}

  ngOnInit() {
    let goin = false;

    if (this.value && this.objectConfig) {
      if (
        this.objectConfig.valueToEmit === Object(this.objectConfig.valueToEmit)
      ) {
        this.objectConfig.valueToSelect = JSON.parse(this.value);
        goin = true;
      } else {
        Object.keys(this.objectConfig.valueToSelect).map(key => {
          if (this.objectConfig.valueToSelect[key] === "undefined") {
            this.objectConfig.valueToSelect[key] = this.value;
            goin = true;
          }
        });
      }

      if (goin) {
        this.__o_
          .one$(
            this.objectConfig.TableName,
            this.objectConfig.valueToSelect,
            this.objectConfig.Region,
            this.objectConfig.AttributesToGet
          )
          .subscribe(item => {
            if (item) {
              this.selected = item[this.objectConfig["attributeToDisplay"]];
              Object.keys(this.objectConfig.valueToSelect).map(key => {
                this.objectConfig.valueToSelect[key] = item[key];
              });
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
      const ExpressionAttributeValues = JSON.parse(
        JSON.stringify(this.objectConfig.ExpressionAttributeValues)
      );
      Object.keys(ExpressionAttributeValues).map(key => {
        if (ExpressionAttributeValues[key] === "undefined") {
          ExpressionAttributeValues[key] = event;
        }
      });

      return this.__q_
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
          null,
          null,
          true,
          this.objectConfig.Region,
          false
        )
        .pipe(
          map(options => {
            return options.Items;
          })
        );
    }
  }

  select(selected?) {
    let valueToEmit;
    if (
      this.objectConfig.valueToEmit === Object(this.objectConfig.valueToEmit)
    ) {
      valueToEmit = JSON.parse(JSON.stringify(this.objectConfig.valueToEmit));
      Object.keys(valueToEmit).map(key => {
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
