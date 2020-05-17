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
import { CrudService } from "src/app/private/firebase/crud.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class FormComponent implements OnInit {
  Properties = [];
  SameFormAsStart = true;
  Specification = {} as any;
  Tabs = {};
  newForm = true;
  Item = {};
  files = {};
  domain;
  load;
  formObject = {};
  key;

  group;
  UrlItem;
  link;
  queryParams;
  Title;
  Subtitle;
  FormValue;
  Form;
  id;

  @Output() data: EventEmitter<object> = new EventEmitter<object>();
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private __o_: OneService,
    private S3Service: S3Service,
    private fvd: FormValueDecoratorService,
    private __g_: CrudService
  ) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {
    this.load = this.router.queryParams.pipe(
      flatMap((params: any) => {
        this.queryParams = { ...params };
        this.UrlItem = this.queryParams.item;
        return this.S3Service.getSpec(
          this.domain +
            "/" +
            this.link +
            "/forms/" +
            this.UrlItem +
            ".form.json"
        );
      }),
      map((data: any) => {
        let spec = JSON.parse(data.Body.toString());
        if (spec.path && !this.queryParams.path) {
          this.queryParams["path"] = spec.path;
        }
        return spec;
      }),
      flatMap((spec: FormSpecification) => {
        this.Specification = spec;

        this.Title = spec.title;
        this.Subtitle = spec.subtitle;

        this.initFormUI();

        if (Object.keys(this.queryParams).length > 1) {
          this.newForm = false;
          return this.getItem();
        }

        return of(null);
      }),
      flatMap((data: any) => {
        return this.initFormValues(data.data());
      }),
      map((data) => {
        this.FormValue = data;

        this.patch.emit(this.Form.value);

        this.Form.valueChanges.subscribe((data) => {
          if ((<any>this.Specification).pluralName) {
            this.SameFormAsStart = this.fvd.isDifferent(
              this.FormValue,
              this.Form.getRawValue()
            );
          } else {
            console.log(this.Form.value);
            this.patch.emit(this.Form.value);
          }
        });

        return this.FormValue;
      })
    );
  }

  private initFormUI() {
    this.Specification.attributes.map((tab: any) => {
      this.Properties.push(tab);
      tab.specs.map((property) => {
        console.log(property);
        if (Array.isArray(property.name)) {
          property.name.map((name) => {
            this.formObject[name] = new FormControl({
              value: null,
              disabled: property.disabled || false,
            });
          });
        } else if (property.name) {
          this.formObject[property.name] = new FormControl(
            {
              value: null,
              disabled: property.disabled || false,
            },
            {
              validators: property.required
                ? Validators.required
                : Validators.min(0),
            }
          );
        }

        if (this.Tabs[tab["name"]]) {
          this.Tabs[tab["name"]].push({
            formItem: this.formObject[property.name],
            itemSpec: property,
          });
        } else {
          this.Tabs[tab["name"]] = [];
          this.Tabs[tab["name"]].push({
            formItem: this.formObject[property.name],
            itemSpec: property,
          });
        }
      });
    });

    this.Form = new FormGroup(this.formObject);
  }

  private initFormValues(item) {
    return new Observable((observer) => {
      const obj = {};

      this.Specification["attributes"].map((tab) => {
        tab.specs.map((property) => {
          if (property.hasOwnProperty("name")) {
            const value: any = this.fvd.getValue(property, item);

            if (value instanceof Observable) {
              value.subscribe((data) => {
                obj[property.name] = data;
                this.Form.get(property.name).setValue(data);
              });
            } else {
              obj[property.name] = value;
              this.Form.get(property.name).setValue(value);
            }
          }
        });
      });

      observer.next(obj);
      observer.complete();
    });
  }

  private handleEvent(eventObj) {
    console.log(eventObj);
    this.Form.patchValue(eventObj);
    this.SameFormAsStart = this.fvd.isDifferent(
      this.FormValue,
      this.Form.value
    );
  }

  handleSelect(name, eventObj) {
    let obj = {};
    obj[name] = eventObj.value;
    this.handleEvent(obj);
  }

  save() {
    this.__g_
      .setDocument(this.queryParams.path, {
        dat: new Date().getTime(),
        ...this.Form.value,
      })
      .subscribe((data) => {
        if (!this.Specification.path) {
          this.route.navigate(["/yet/data/flist"], {
            queryParams: {
              item: this.UrlItem,
            },
          });
        }
      });
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

        this.Form.patchValue(patch);
        break;

      default:
        true;
    }
  }

  getItem() {
    return this.__g_.getDocument(this.queryParams.path);
  }
}
