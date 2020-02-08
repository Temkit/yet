import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { FormValueDecoratorService } from "src/app/private/soft/FormValueDecorator.service";
import { CreateService } from "src/app/private/crud/create.service";
import { UpdateService } from "src/app/private/crud/update.service";
import isEmpty from "lodash/isEmpty";

@Component({
  selector: "app-formView",
  templateUrl: "./formView.component.html",
  styleUrls: ["./formView.component.css"]
})
export class FormViewComponent implements OnInit {
  ready;
  object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fvd: FormValueDecoratorService,
    private __c_: CreateService,
    private __u_: UpdateService
  ) {}

  ngOnInit() {
    this.ready = this.route.queryParams.pipe(
      map(params => {
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
        .subscribe(data => {
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
          .subscribe(data => {
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
          item: to
        }
      });
    } else {
      this.router.navigate(["/yet/data/form"], {
        queryParams: {
          item: to
        }
      });
    }
  }
}
