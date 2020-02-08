import { Component, OnInit, Input, ElementRef } from "@angular/core";
import { map } from "rxjs/operators";
import { of } from "rxjs";
import { OneService } from "src/app/private/crud/one.service";
import { CognitoService } from "src/app/private/aws/cognito.service";

@Component({
  selector: "app-decorator",
  templateUrl: "./decorator.component.html",
  styleUrls: ["./decorator.component.css"]
})
export class DecoratorComponent implements OnInit {
  element;
  key;
  style;
  style_after;
  class;
  valueToDisplay;
  valueToDisplayArray = [];
  data;
  now;
  img;

  constructor(
    private cognito: CognitoService,
    private __o_: OneService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.now = new Date().getTime();
    this.style = this.element.style ? this.element.style : null;

    this.class = "symbol" + this.element.name;
    this.style_after = this.element.style_after
      ? "." + this.class + "::before " + this.element.style_after
      : null;

    this.createStyle(this.style_after);

    if (this.element.key) {
      if (this.element.type === "badgeArray") {
        this.data = this.data[this.element.name];

        this.valueToDisplayArray = [];
        this.data.map(item => {
          let key = JSON.parse(JSON.stringify(this.element.key));

          Object.keys(key).map(k => {
            if (key[k] === "undefined") {
              key[k] = item;
            }
          });

          this.valueToDisplayArray.push(
            this.__o_
              .one$(this.element.TableName, key, this.element.Region)
              .pipe(
                map((data: any) => {
                  return data.valeur + "%";
                })
              )
          );
        });
      } else if (this.element.type === "data") {
        const keyTmp = JSON.parse(JSON.stringify(this.element.key));

        Object.keys(keyTmp).map(k => {
          if (keyTmp[k] === "undefined") {
            keyTmp[k] = this.data[this.element[k]];
          }
        });

        this.valueToDisplay = this.__o_
          .one$(this.element.TableName, keyTmp, this.element.Region)
          .pipe(
            map((data: any) => {
              return data;
            })
          );
      } else if (this.data) {
        Object.keys(this.element.key).map(key => {
          if (this.element.key[key] === "undefined") {
            this.element.key[key] = this.data[key];
          }
        });

        this.valueToDisplay = this.__o_
          .one$(this.element.TableName, this.element.key, this.element.Region)
          .pipe(
            map((data: any) => {
              return data;
            })
          );
      }
    } else if (this.element.UserPoolId) {
      if (this.data) {
        this.valueToDisplay = this.cognito
          .queryUser(
            this.element.UserPoolId,
            this.element.display,
            this.element.Filter +
              ' ^= "' +
              this.data[this.element.dataattr] +
              '"'
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
              return users[0];
            })
          );
      }
    } else if (this.element.type === "money") {
      this.valueToDisplay = this.data
        ? of(
            this.data.toLocaleString("us-US", {
              style: "currency",
              currency: this.element.currency
            })
          )
        : null;
    } else if (this.element.type === "image") {
      this.img =
        "https://s3.eu-west-3.amazonaws.com/" +
        this.element.bucket +
        "/" +
        this.element.imagePath +
        "/" +
        this.data +
        "/" +
        this.element.imageName +
        "?dummy=" +
        this.now;
    } else {
      this.valueToDisplay = of(this.data);
    }
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
    }
  }

  createStyle(style: string): void {
    const styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(style));
    this.el.nativeElement.appendChild(styleElement);
  }
}
