import { map } from "rxjs/operators";
import { flatMap } from "rxjs/operators";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import isEqualWith from "lodash/isEqualWith";
import { of, Observable } from "rxjs";
import { FormVars } from "src/app/private/interfaces/form.vars";
import { S3Service } from "./../../../../private/aws/s3.service";
import { FormValueDecoratorService } from "src/app/private/soft/FormValueDecorator.service";

@Component({
  selector: "app-form-mini",
  templateUrl: "./form-mini.component.html",
  styleUrls: ["./form-mini.component.css"],
})
export class FormMiniComponent implements OnInit {
  @Output() save: EventEmitter<object> = new EventEmitter<object>();

  vars = {
    Properties: [],
    SameFormAsStart: true,
    Specification: {},
    ImageValues: "{}",
    imageIdCollecter: {},
    Tabs: {},
    newForm: true,
    Item: {},
    files: {},
  } as FormVars;

  type = null;
  load;
  path;
  id;
  formObject = {};
  key;
  objectConfig;
  group;
  link;

  constructor(
    private S3Service: S3Service,
    private fvd: FormValueDecoratorService
  ) {
    this.vars.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {
    let key =
      this.type === "category"
        ? this.vars.domain +
          "/" +
          this.link +
          "/categories/" +
          this.vars.UrlItem +
          ".form.json"
        : this.vars.domain +
          "/" +
          this.link +
          "/forms/" +
          this.vars.UrlItem +
          ".form.json";

    this.load = this.S3Service.getSpec(key).pipe(
      flatMap((spec: any) => {
        this.vars.Specification = JSON.parse(spec.Body.toString());
        this.vars.Title = this.vars.Specification.title;
        this.vars.Subtitle = this.vars.Specification.subtitle;
        this.vars.database = this.vars.Specification.Database;

        this.initFormUI();

        if (this.objectConfig.value) {
          this.vars.newForm = false;
          return of(this.objectConfig.value);
        }
        return of(null);
      }),
      flatMap((data) => {
        if (data) {
          console.log(data);
          this.path = data!.ref!.path;
          this.id = data!.id;
          data = data.data();
          return this.initFormValues(data);
        } else {
          return this.initFormValues({});
        }
      }),
      map((data) => {
        this.vars.FormValue = data;
        this.vars.Form.valueChanges.subscribe(() => {
          this.vars.SameFormAsStart = isEqualWith(
            this.vars.FormValue,
            this.vars.Form.getRawValue(),
            this.fvd.customizer
          );

          if (!this.vars.SameFormAsStart) {
            this.emit();
          }
        });

        return this.vars.FormValue;
      })
    );
  }

  private initFormUI() {
    Object.keys(this.vars.Specification.attributes).map((tab) => {
      this.vars.Properties.push(tab);
      this.vars.Specification["attributes"][tab].map((property) => {
        if (Array.isArray(property.name)) {
          property.name.map((name) => {
            this.formObject[name] = new FormControl({
              value: null,
              disabled: property.disabled,
            });
          });
        } else if (property.name) {
          this.formObject[property.name] = new FormControl({
            value: null,
            disabled: property.disabled,
          });
        }

        if (this.vars.Tabs[tab]) {
          this.vars.Tabs[tab].push(this.formObject[property.name]);
        } else {
          this.vars.Tabs[tab] = [];
          this.vars.Tabs[tab].push(this.formObject[property.name]);
        }
      });
    });

    this.vars.Form = new FormGroup(this.formObject);
  }

  private initFormValues(item) {
    return new Observable((observer) => {
      const obj = {};
      Object.keys(this.vars.Specification["attributes"]).map((tab) => {
        this.vars.Specification["attributes"][tab].map((property) => {
          if (property.hasOwnProperty("name")) {
            const value: any = this.fvd.getValue(property, item);
            if (value instanceof Observable) {
              value.subscribe((data) => {
                obj[property.name] = data;
                this.vars.Form.patchValue(obj);
              });
            } else {
              obj[property.name] = value;
              this.vars.Form.patchValue(obj);
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
  }

  handleSelect(name, eventObj) {
    let obj = {};
    obj[name] = eventObj.value;
    this.vars.FormValue[name] = eventObj.value;
    this.handleEvent(obj);
  }

  emit() {
    this.save.emit(this.vars.Form.getRawValue());
    this.vars.SameFormAsStart = true;
  }

  patchType(element, event) {
    const patch = {};
    switch (element.datatype) {
      case "int":
        if (
          (element.type === "checkbox" || element.type === "slidetoggle") &&
          event.checked
        ) {
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

  @Input()
  set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
      this.vars.UrlItem = this.objectConfig.config.item;
      this.type = this.objectConfig.config.type;
    }
  }
}
