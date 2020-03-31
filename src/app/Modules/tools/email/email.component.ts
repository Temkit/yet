import { QueryService } from "./../../../private/crud/query.service";
import { Component, OnInit } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { map, flatMap } from "rxjs/operators";
import { SEService } from "src/app/private/aws/ses.service";
import { S3Service } from "./../../../private/aws/s3.service";

const header = new HttpHeaders({
  "content-type": "application/json",
  "x-api-key": "yoWdyAcVah26yYguY2dkzNzVv7KzrFV4mQAfSyCi"
});

@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.css"]
})
export class EmailComponent implements OnInit {
  domain;
  autocomplete;
  compagne;
  config;
  Specification;
  contacts$;
  emails;
  link;
  waitEmails = null;
  startwaitEmails = false;
  TopicARN;

  emailForm = new FormGroup({
    from: new FormControl({
      value: "",
      disabled: true
    }),
    to: new FormArray([new FormControl("")]),
    objet: new FormControl(""),
    message: new FormControl("")
  });

  constructor(
    private S3Service: S3Service,
    private route: ActivatedRoute,
    private __q_: QueryService,
    private ses: SEService
  ) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {
    this.compagne = this.route.queryParams.pipe(
      map((params: any) => {
        return params.item;
      }),
      flatMap(data => {
        return this.S3Service.getSpec(
          this.domain + "/" + this.link + "/tools/" + data + ".tool.json"
        ).pipe(
          map((spec: any) => {
            return JSON.parse(spec.Body.toString());
          })
        );
      }),
      map((data: any) => {
        this.Specification = data;

        this.emailForm.get("from").patchValue(data.sender);

        this.contacts$ = this.__q_
          .query$(
            "query",
            this.Specification.contacts.TableName,
            this.Specification.contacts.IndexName,
            this.Specification.contacts.KeyConditionExpression,
            this.Specification.contacts.ProjectionExpression,
            this.Specification.contacts.FilterExpression,
            this.Specification.contacts.ExpressionAttributeNames,
            this.Specification.contacts.ExpressionAttributeNames_Additional,
            this.Specification.contacts.ExpressionAttributeValues,
            this.Specification.contacts.limit,
            null,
            true,
            this.Specification.contacts.Region,
            null,
            false
          )
          .pipe(
            map(data => {
              this.emails = data.Items;
              return data.Items;
            })
          );
        return data;
      })
    );
  }

  handlecontent(event) {
    this.emailForm.patchValue(event);
  }

  handleEvent(event) {
    let key = JSON.parse(JSON.stringify(this.Specification.Key));

    Object.keys(key).map(k => {
      if (key[k] === "undefined") {
        key[k] = event[k];
      }
    });
  }

  send() {
    const emailstoSend = [];

    this.emails.map(item => {
      emailstoSend.push(item.email);
    });

    this.startwaitEmails = true;
    this.waitEmails = this.ses
      .sendEMAILs(
        emailstoSend,
        this.emailForm.get("message").value,
        this.emailForm.get("objet").value,
        "yet.marketing"
      )
      .subscribe(data => {
        this.emailForm.reset();

        this.startwaitEmails = false;
      });
  }
}
