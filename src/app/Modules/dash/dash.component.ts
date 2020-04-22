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
  styleUrls: ["./dash.component.css"],
})
export class DashComponent implements OnInit {
  dashs;
  domain;
  datastudio;
  user;
  spec;
  charts;

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
      map((params) => {
        return params.item;
      }),
      flatMap((data) => {
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
          if (spec.finnance) {
            this.datastudio = false;

            this.user = this.authService.userAttributes["name"];

            let finnance = this.__q_
              .query$(
                spec.finnance.query.type,
                spec.finnance.query.TableName,
                spec.finnance.query.IndexName,
                spec.finnance.query.KeyConditionExpression,
                spec.finnance.query.ProjectionExpression,
                spec.finnance.query.FilterExpression,
                spec.finnance.query.ExpressionAttributeNames,
                spec.finnance.query.ExpressionAttributeNames_Additional,
                spec.finnance.query.ExpressionAttributeValues,
                spec.finnance.query.Limit,
                null,
                true,
                spec.finnance.query.Region,
                null,
                false
              )
              .pipe(
                map((data) => {
                  console.log(data);
                  return data.Items;
                })
              );

            return forkJoin({ finnance });
          }
        }
      }),
      map((data) => {
        if (this.spec.options) {
          this.charts = { ...this.spec.options };

          (<any>data).finnance.forEach((item) => {
            this.charts.xAxis[0].data.push(item.time);
          });

          this.charts.xAxis[0].data = this.charts.xAxis[0].data.reverse();
          this.charts.series.map((serie) => {
            (<any>data).finnance.forEach((item) => {
              console.log(item);
              if (serie.name === "Total vente") {
                serie.data.push(item.day[2]);
              } else if (serie.name === "Reste à payer") {
                serie.data.push(item.day[1]);
              } else if (serie.name === "Réglement") {
                serie.data.push(item.day[0]);
              }
            });

            serie.data = serie.data.reverse();
            return serie;
          });
        }

        console.log(this.charts);
        return data;
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
