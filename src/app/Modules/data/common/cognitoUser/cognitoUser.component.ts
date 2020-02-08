import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild
} from "@angular/core";
import { CognitoService } from "src/app/private/aws/cognito.service";
import { FormControl } from "@angular/forms";
import { map } from "rxjs/operators";
import { MatAutocomplete } from "@angular/material";
import { Observable } from "rxjs";

@Component({
  selector: "app-cognitoUser",
  templateUrl: "./cognitoUser.component.html",
  styleUrls: ["./cognitoUser.component.css"]
})
export class CognitoUserComponent implements OnInit {
  objectConfig = {} as any;
  val;
  options: Observable<any>;
  selected = "";

  formControl = new FormControl("");
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  @Input() set config(value) {
    this.objectConfig = JSON.parse(value);
  }
  @Input() set value(value) {
    this.val = JSON.parse(value);
  }

  @ViewChild(MatAutocomplete, { static: false })
  matAutocomplete: MatAutocomplete;

  constructor(private cognitoService: CognitoService) {}

  ngOnInit() {
    if (this.val && this.objectConfig) {
      this.cognitoService
        .getUser(this.objectConfig.UserPoolId, this.val.username)
        .subscribe(data => {
          console.log(
            this.objectConfig["attributeToDisplay"],
            data[this.objectConfig["attributeToDisplay"]]
          );

          let tmp = {};
          tmp[this.objectConfig["name"]] =
            data[this.objectConfig["attributeToDisplay"]];

          this.formControl.patchValue(tmp);
        });
    }
  }

  onChanges(event): void {
    this.options = this.getOptions(event);
  }

  private getOptions(event) {
    if (event.length > 2) {
      return this.cognitoService
        .queryUser(
          this.objectConfig.UserPoolId,
          this.objectConfig.atg,
          this.objectConfig.filter + ' ^= "' + event + '"'
        )
        .pipe(
          map((data: any) => {
            let users = [];

            data.Users.map(item => {
              let user = {};
              item.Attributes.map(attr => {
                user[attr.Name] = attr.Value;
              });

              users.push(user);
            });

            return users;
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
          valueToEmit[key] =
            selected.value[this.objectConfig["attributeToStore"]];
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
    this.objectConfig.valueToSelect = "";
    this.emit(null);
  }

  emit(valueToEmit) {
    this.patch.emit(valueToEmit);

    this.options = null;
  }
}
