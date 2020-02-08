import { QueryService } from "src/app/private/crud/query.service";
import { Component, OnInit } from "@angular/core";
import { S3Service } from "./../../private/aws/s3.service";
import { map, flatMap } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from "src/app/private/aws/auth.service";
import { ActivatedRoute } from "@angular/router";
import { forkJoin, of } from "rxjs";

@Component({
  selector: "app-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.css"]
})
export class DashComponent implements OnInit {
  dashs;
  domain;
  datastudio;
  user;
  spec;

  constructor(
    private S3Service: S3Service,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private __q_: QueryService
  ) {}

  ngOnInit() {
    this.domain = localStorage.getItem("domain");

    this.dashs = this.route.queryParams.pipe(
      map(params => {
        return params.item;
      }),
      flatMap(data => {
        return this.S3Service.getSpec(this.domain + "/" + data + ".json").pipe(
          map((spec: any) => {
            return JSON.parse(spec.Body.toString());
          })
        );
      }),
      flatMap((spec: any) => {
        this.spec = spec;
        if (spec.ds) {
          this.datastudio = true;
          return of(
            this.sanitizer.bypassSecurityTrustResourceUrl(
              "https://datastudio.google.com/embed/reporting/" +
                spec.ds +
                "/page/1M"
            )
          );
        } else {
          this.datastudio = false;

          let info$ = {};

          spec.info.forEach(info => {
            Object.keys(info.query.ExpressionAttributeValues).map(key => {
              info.query.ExpressionAttributeValues[key] = this.getData(
                info.query.ExpressionAttributeValues[key]
              );
            });

            let TableName = info.query.TableName;
            let IndexName = info.query.IndexName;
            let ProjectionExpression = info.query.ProjectionExpression;
            let FilterExpression = info.query.FilterExpression;
            let Region = info.query.Region;
            let KeyConditionExpression = info.query.KeyConditionExpression;
            let ExpressionAttributeValues =
              info.query.ExpressionAttributeValues;
            let ExpressionAttributeNames = info.query.ExpressionAttributeNames;

            info$[info.name] = this.__q_
              .query$(
                "query",
                TableName,
                IndexName,
                KeyConditionExpression,
                ProjectionExpression,
                FilterExpression,
                ExpressionAttributeNames,
                {},
                ExpressionAttributeValues,
                null,
                null,
                true,
                Region,
                false
              )
              .pipe(
                map(data => {
                  switch (info.op) {
                    case "SUM":
                      let sum = 0;
                      data.Items.map(
                        item => (sum = sum + parseFloat(item[info.column]))
                      );
                      let item = {
                        color: info.color,
                        link: info.link,
                        value: sum.toLocaleString("us-US", {
                          style: "currency",
                          currency: "DZD"
                        })
                      };

                      return item;
                    default:
                      1 === 1;
                  }
                })
              );
          });

          this.user = this.authService.userAttributes["name"];

          return forkJoin(info$);
        }
      })
    );
  }

  getData(attribute) {
    if (typeof attribute === "string" && attribute.includes("undefined")) {
      attribute = attribute.replace("undefined|", "");

      switch (attribute) {
        case "custom:id":
          return this.authService.userAttributes[attribute];

        case "today":
          return new Date().getTime();
        case "tomorow":
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.getTime();

        default:
          return attribute;
      }
    }

    return attribute;
  }
}
