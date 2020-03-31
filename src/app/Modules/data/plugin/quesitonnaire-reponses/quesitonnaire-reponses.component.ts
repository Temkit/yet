import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { QueryService } from "src/app/private/crud/query.service";
import { values } from "lodash-es";
import { of } from "rxjs";

@Component({
  selector: "app-quesitonnaire-reponses",
  templateUrl: "./quesitonnaire-reponses.component.html",
  styleUrls: ["./quesitonnaire-reponses.component.css"]
})
export class QuesitonnaireReponsesComponent implements OnInit {
  load;
  qId;
  domain;
  group;
  objectConfig;
  objectValue;
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  @Input() key;
  @Input() value;
  @Input() config;

  allanswers;

  values;
  questions$;

  backgroundColor = JSON.stringify([
    "rgba(255,99,132,1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)"
  ]);
  borderColor = JSON.stringify([
    "rgba(255,99,132,1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)"
  ]);
  borderWidth = 1;
  beginAtZero = true;

  constructor(private router: ActivatedRoute, private __q_: QueryService) {
    this.domain = localStorage.getItem("domain");
    this.group = localStorage.getItem("group");
  }

  ngOnInit() {
    this.key = JSON.parse(this.key);
    this.values = JSON.parse(this.value);
    this.objectConfig = JSON.parse(this.config);
    if (this.values) {
      this.questions$ = this.__q_
        .query$(
          "query",
          this.objectConfig.TableName,
          this.objectConfig.IndexName,
          this.objectConfig.KeyConditionExpression,
          this.objectConfig.ProjectionExpression,
          this.objectConfig.FilterExpression,
          this.objectConfig.ExpressionAttributeNames,
          {},
          this.objectConfig.ExpressionAttributeValues,
          this.objectConfig.Limit,
          null,
          true,
          this.objectConfig.Region,
          null,
          false
        )
        .pipe(
          map(data => {
            this.values.map((question: any, i) => {
              let labels = [];
              let vals = [];
              question.reponses.map(reponse => {
                vals.push(this.getNbAnswers(data.Items, i, reponse.reponse));
                labels.push(reponse.reponse);
              });

              question = Object.assign(question, {
                data: JSON.stringify(vals),
                labels: JSON.stringify(labels),
                label: question.question
              });
            });

            return this.values;
          })
        );
    }
  }

  getNbAnswers(all, index, reponse) {
    let n = 0;
    all.map(reponses => {
      if (reponses.reponses[index].reponse === reponse) {
        n = n + 1;
      }
    });

    return n;
  }
}
