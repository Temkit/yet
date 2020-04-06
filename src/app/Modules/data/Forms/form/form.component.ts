import { flatMap, map } from "rxjs/operators";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { S3Service } from "./../../../../private/aws/s3.service";
import { of, Observable } from "rxjs";
import {
  FormVars,
  FormSpecification,
} from "src/app/private/interfaces/form.vars";
import { OneService } from "src/app/private/crud/one.service";
import { FormValueDecoratorService } from "src/app/private/soft/FormValueDecorator.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class FormComponent implements OnInit {
  vars = {
    Properties: [],
    SameFormAsStart: true,
    Specification: {} as any,
    Tabs: {},
    newForm: true,
    Item: {},
    files: {},
  } as FormVars;

  load;
  formObject = {};
  key;

  group;
  link;
  queryParams;

  @Output() data: EventEmitter<object> = new EventEmitter<object>();
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private __o_: OneService,
    private S3Service: S3Service,
    private fvd: FormValueDecoratorService
  ) {
    this.vars.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {
    this.load = this.S3Service.getSpec(
      this.vars.domain +
        "/" +
        this.link +
        "/forms/" +
        this.vars.UrlItem +
        ".form.json"
    ).pipe(
      map((data: any) => {
        let spec = JSON.parse(data.Body.toString());
        return spec;
      }),
      flatMap((spec: FormSpecification) => {
        this.vars.Specification = spec;

        this.vars.Title = spec.title;
        this.vars.Subtitle = spec.subtitle;
        this.vars.database = spec.Database;
        this.initFormUI();

        if (Object.keys(this.queryParams).length > 1) {
          this.vars.newForm = false;
          return this.getItem();
        } else if (this.vars.UrlItem === "config") {
          this.queryParams = Object.assign(
            this.queryParams,
            this.vars.Specification.Key
          );
          return this.getItem();
        }

        return of(null);
      }),
      flatMap((data) => {
        return this.initFormValues(data);
      }),
      map((data) => {
        this.vars.FormValue = data;

        this.patch.emit(this.vars.Form.value);

        this.vars.Form.valueChanges.subscribe((data) => {
          if ((<any>this.vars.Specification).pluralName) {
            this.vars.SameFormAsStart = this.fvd.isDifferent(
              this.vars.FormValue,
              this.vars.Form.getRawValue()
            );
          } else {
            this.patch.emit(this.vars.Form.value);
          }
        });

        return this.vars.FormValue;
      })
    );
  }

  private initFormUI() {
    this.vars.Specification.attributes.map((tab: any) => {
      this.vars.Properties.push(tab);
      tab.specs.map((property) => {
        if (Array.isArray(property.name)) {
          property.name.map((name) => {
            this.formObject[name] = new FormControl({
              value: null,
              disabled: property.disabled,
            });
          });
        } else if (property.name) {
          this.formObject[property.name] = new FormControl(
            {
              value: null,
              disabled: property.disabled,
            },
            {
              validators: property.required
                ? Validators.required
                : Validators.min(0),
            }
          );
        }

        if (this.vars.Tabs[tab["name"]]) {
          this.vars.Tabs[tab["name"]].push({
            formItem: this.formObject[property.name],
            itemSpec: property,
          });
        } else {
          this.vars.Tabs[tab["name"]] = [];
          this.vars.Tabs[tab["name"]].push({
            formItem: this.formObject[property.name],
            itemSpec: property,
          });
        }
      });
    });

    this.vars.Form = new FormGroup(this.formObject);
  }

  private initFormValues(item) {
    return new Observable((observer) => {
      const obj = {};

      this.vars.Specification["attributes"].map((tab) => {
        tab.specs.map((property) => {
          if (property.hasOwnProperty("name")) {
            const value: any = this.fvd.getValue(property, item);

            if (value instanceof Observable) {
              value.subscribe((data) => {
                obj[property.name] = data;
                this.vars.Form.get(property.name).setValue(data);
              });
            } else {
              obj[property.name] = value;
              this.vars.Form.get(property.name).setValue(value);
            }
          }
        });
      });

      observer.next(obj);
      observer.complete();
    });
  }

  private handleEvent(eventObj) {
    this.vars.Form.patchValue(eventObj);
    this.vars.SameFormAsStart = this.fvd.isDifferent(
      this.vars.FormValue,
      this.vars.Form.value
    );
  }

  handleSelect(name, eventObj) {
    let obj = {};
    obj[name] = eventObj.value;
    this.handleEvent(obj);
  }

  save() {
    this.data.emit({
      vars: this.vars,
      key: this.key,
    });

    this.vars.SameFormAsStart = true;
  }

  patchType(element, event) {
    const patch = {};
    switch (element.datatype) {
      case "int":
        if (element.type === "checkbox" && event.checked) {
          patch[element.name] = 1;
        } else {
          patch[element.name] = 0;
        }

        this.vars.Form.patchValue(patch);
        break;

      default:
        true;
    }
  }

  getItem() {
    this.key = JSON.parse(JSON.stringify(this.vars.Specification.Key));
    Object.keys(this.key).map((k) => {
      if (this.key[k] === "undefined") {
        this.key[k] = this.queryParams[k];
      }
    });

    return this.__o_.one$(
      this.vars.Specification.TableName,
      this.key,
      this.vars.Specification.Region
    );
  }

  @Input()
  set config(val) {
    if (val) {
      this.queryParams = JSON.parse(val);
      this.vars.UrlItem = this.queryParams.item;
    }
  }
}
