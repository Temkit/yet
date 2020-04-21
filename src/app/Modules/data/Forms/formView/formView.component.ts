import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, flatMap } from "rxjs/operators";
import { FormValueDecoratorService } from "src/app/private/soft/FormValueDecorator.service";
import { CreateService } from "src/app/private/crud/create.service";
import { UpdateService } from "src/app/private/crud/update.service";
import isEmpty from "lodash/isEmpty";

@Component({
  selector: "app-formView",
  templateUrl: "./formView.component.html",
  styleUrls: ["./formView.component.css"],
})
export class FormViewComponent implements OnInit {
  ready;
  object;

  constructor(
    private HttpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fvd: FormValueDecoratorService,
    private __c_: CreateService,
    private __u_: UpdateService
  ) {}

  ngOnInit() {
    this.ready = this.route.queryParams.pipe(
      map((params) => {
        this.object = params;
        return JSON.stringify(params);
      })
    );
  }

  save(event) {
    if (event.vars.newForm) {
      this.__c_
        .create$(
          event.vars.Specification.TableName,
          event.vars.Form.getRawValue(),
          event.vars.Specification.Region
        )
        .pipe(
          flatMap((data) => {
            console.log(data);
            let headers = new HttpHeaders({
              "Content-Type": "application/json",
              "x-api-key": (<any>event.vars.Specification).index.key,
            });

            let Body = {} as any;

            Body.lang = (<any>event.vars.Specification).index.lang;
            Body.id = event.vars.Form.getRawValue()[
              (<any>event.vars.Specification).index.id
            ];
            Body.text = "";
            (<any>event.vars.Specification).index.attr.forEach((at) => {
              Body.text = Body.text + " " + event.vars.Form.getRawValue()[at];
            });

            return this.HttpClient.post(
              (<any>event.vars.Specification).index.endpoint,
              Body,
              { headers }
            );
          })
        )
        .subscribe((data) => {
          this.navigate(event.vars.UrlItem);
        });
    } else {
      //   console.log(event.vars.Form.getRawValue(), event.vars.FormValue, this.fvd.difference(event.vars.Form.getRawValue(), event.vars.FormValue));
      if (
        !isEmpty(
          this.fvd.difference(
            event.vars.Form.getRawValue(),
            event.vars.FormValue
          )
        )
      ) {
        this.__u_
          .updateConstructor$(
            event.vars.Specification.TableName,
            event.key,
            this.fvd.difference(
              event.vars.Form.getRawValue(),
              event.vars.FormValue
            ),
            event.vars.Specification.Region
          )
          .pipe(
            map((data) => {
              if ((<any>event.vars.Specification).index) {
                let headers = new HttpHeaders({
                  "Content-Type": "application/json",
                  "x-api-key": (<any>event.vars.Specification).index.key,
                });

                let Body = {} as any;

                Body.lang = (<any>event.vars.Specification).index.lang;
                Body.id = event.vars.Form.getRawValue()[
                  (<any>event.vars.Specification).index.id
                ];
                Body.text = "";
                (<any>event.vars.Specification).index.attr.forEach((at) => {
                  Body.text =
                    Body.text + " " + event.vars.Form.getRawValue()[at];
                });

                return this.HttpClient.post(
                  (<any>event.vars.Specification).index.endpoint,
                  Body,
                  { headers }
                );
              }
            })
          )
          .subscribe((data) => {
            this.navigate(event.vars.UrlItem);
          });
      } else {
        this.navigate(event.vars.UrlItem);
      }
    }
  }

  private navigate(to) {
    if (to !== "config") {
      this.router.navigate(["/yet/data/list"], {
        queryParams: {
          item: to,
        },
      });
    } else {
      this.router.navigate(["/yet/data/form"], {
        queryParams: {
          item: to,
        },
      });
    }
  }
}
