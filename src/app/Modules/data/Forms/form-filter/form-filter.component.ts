import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from "@angular/core";
import { FormVars } from "src/app/private/interfaces/form.vars";
import { map } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { GenericRetryStrategyService } from "./../../../../private/genericRetryStrategy.service";
import { S3Service } from "./../../../../private/aws/s3.service";
@Component({
  selector: "app-form-filter",
  templateUrl: "./form-filter.component.html",
  styleUrls: ["./form-filter.component.css"]
})
export class FormFilterComponent implements OnChanges, OnInit {
  @Input() config;
  @Output() save: EventEmitter<object> = new EventEmitter<object>();

  vars = {} as FormVars;

  load;

  tmpelement = null;
  formObject = {};
  objectConfig;
  group;
  link;

  constructor(private S3Service: S3Service) {
    this.vars.domain = localStorage.getItem("domain");

    this.link = localStorage.getItem("group");
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const config: SimpleChange = changes.config;

    this.objectConfig = JSON.parse(config.currentValue);
    this.vars.UrlItem = this.objectConfig.config.item;

    this.load = this.S3Service.getSpec(
      this.vars.domain +
        "/" +
        this.link +
        "/filters/" +
        this.vars.UrlItem +
        ".form.json"
    ).pipe(
      map((data: any) => {
        this.initVars();
        this.formObject = {};
        this.tmpelement = null;

        this.vars.Specification = JSON.parse(data.Body.toString());
        this.initFormUI();

        return this.vars.Form.value;
      })
    );
  }

  private initFormUI() {
    Object.keys(this.vars.Specification.attributes).map(tab => {
      this.vars.Properties.push(tab);
      this.vars.Specification["attributes"][tab].map(property => {
        if (Array.isArray(property.name)) {
          property.name.map(name => {
            this.formObject[name] = new FormControl({
              value: property.value,
              disabled: property.disabled
            });
          });
        } else if (property.name) {
          this.formObject[property.name] = new FormControl({
            value: property.value,
            disabled: property.disabled
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

  handleEvent(config, event: any) {
    let item = {} as any;

    let startquery = config.startquery || 3;
    if (
      event.target &&
      (event.target.value.length > startquery ||
        event.target.value.length === 0)
    ) {
      item["query"] = config.init.query;

      let obj = {};
      obj[config.name] = event.target.value;

      item["value"] = obj;

      this.save.emit(item);
    }
  }

  emit(values?) {}

  patchType(element, event) {
    this.tmpelement = element;

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

        if (element.type === "radio") {
          patch[element.name] = event.value;
        }

        this.vars.Form.patchValue(patch);

        break;

      case "text":
        patch[element.name] = event;

        break;
      case "autocomplete":
        if (event.target.value.length > 3) {
          this.emit(event);
        }
        break;
      case "date":
        if (event) {
          let item = {} as any;
          item["query"] = element.init.query;

          item["value"] = event;

          this.save.emit(item);
        }
        break;
      default:
        // tslint:disable-next-line:no-unused-expression
        true;
    }
  }

  private initVars() {
    this.vars.Properties = [];
    this.vars.SameFormAsStart = true;
    this.vars.ImageValues = "{}";
    this.vars.imageIdCollecter = {};
    this.vars.Tabs = {};
    this.vars.newForm = true;
    this.vars.Item = {};
    this.vars.files = {};
  }
}
