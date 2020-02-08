import { Component, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormControl } from "@angular/forms";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/private/aws/auth.service";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { switchMap, flatMap, map, retry, retryWhen } from "rxjs/operators";
import { OneService } from "src/app/private/crud/one.service";
import { CreateService } from "src/app/private/crud/create.service";
import { GenericRetryStrategyService } from "./../../../private/genericRetryStrategy.service";
import { S3Service } from "./../../../private/aws/s3.service";

const header = new HttpHeaders({
  "content-type": "application/json",
  "x-api-key": "ntTouvvlU49cWknDlUNAS6Hh1Vo5CmIN4CdrKFmj"
});

@Component({
  selector: "app-sms",
  templateUrl: "./sms.component.html",
  styleUrls: ["./sms.component.css"]
})
export class SmsComponent implements OnInit {
  domain;
  autocomplete;
  compagne;
  config;
  Specification;
  contacts;
  phones;
  link;
  TopicARN;

  smsForm = new FormGroup({
    from: new FormControl({
      value: this.auth.Cache.getItem("domain"),
      disabled: true
    }),
    to: new FormArray([new FormControl("")]),
    message: new FormControl("")
  });

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private __o_: OneService,
    private __c_: CreateService,
    private retry: GenericRetryStrategyService,
    private S3Service: S3Service
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
      retryWhen(this.retry.genericRetryStrategy()),
      map(data => {
        this.Specification = data;
        return data;
      })
    );
  }

  handleEvent(event) {
    let key = JSON.parse(JSON.stringify(this.Specification.Key));

    Object.keys(key).map(k => {
      if (key[k] === "undefined") {
        key[k] = event[k];
      }
    });

    this.contacts = this.__o_
      .one$(this.Specification.TableName, key, this.Specification.Region)
      .pipe(
        map((data: any) => {
          this.phones = data.contacts.value;
          this.TopicARN = data.contacts.TopicARN;
          return data.contacts.value;
        })
      );
  }

  send() {
    const phonestoSend = [];

    this.phones.map(item => {
      if (item.phone.toString().length === 9) {
        phonestoSend.push("+213" + item.phone);
      } else if (item.phone.toString().length === 10) {
        phonestoSend.push("+213" + item.phone.substring(1));
      } else if (item.phone.includes("00213")) {
        phonestoSend.push("+" + item.phone.substring(2));
      } else if (item.phone.includes("+2130")) {
        phonestoSend.push("+213" + item.phone.substring(5));
      }
    });

    this.http
      .post(
        "https://api.yet.marketing/g/ym1/sms",
        {
          t: this.TopicARN,
          m: this.smsForm.get("message").value
        },
        { headers: header }
      )
      .subscribe((data: any) => {
        if (data.statusCode === 200) {
          this.snackBar.open("SMS envoyé", "" + phonestoSend.length, {
            horizontalPosition: "center",
            verticalPosition: "top",
            duration: 50000
          });

          const store$ = [];

          this.phones.map(item => {
            item = Object.assign(item, data.body);
            item = Object.assign(item, { website: this.domain });
            item = Object.assign(item, data.body);
            item = Object.assign(item, {
              text: this.smsForm.get("message").value
            });
            store$.push(item);
          });

          this.__c_
            .batchWrite$("sms-email", store$, "eu-central-1")
            .subscribe(data => {
              console.log(data);
            });
        } else {
          this.snackBar.open("SMS envoyé", "" + phonestoSend.length, {
            horizontalPosition: "center",
            verticalPosition: "bottom",
            duration: 50000
          });
        }
      });
  }
}
