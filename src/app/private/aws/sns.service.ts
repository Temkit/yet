import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import * as AWS from "aws-sdk";
import { bindCallback, forkJoin, from } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { flatMap, map, switchMap } from "rxjs/operators";

import Auth from "@aws-amplify/auth";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class SnsService {
  private sns;
  private TopicArn;
  isBrowser;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  createTopic(name, DisplayName) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        flatMap(credentials => {
          AWS.config.update({
            region: "us-east-1",
            credentials: credentials,
            apiVersions: {
              sns: "2010-03-31"
            }
          });

          this.sns = new AWS.SNS();

          return from(
            this.sns
              .createTopic({
                Name: name,
                Attributes: {
                  DisplayName: DisplayName
                }
              })
              .promise()
          );
        }),
        map((data: any) => {
          return data.TopicArn;
        })
      );
    }
  }

  smsTopciSubscription(endpoint, topic) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        flatMap(credentials => {
          AWS.config.update({
            region: "us-east-1",
            credentials: credentials,
            apiVersions: {
              sns: "2010-03-31"
            }
          });

          this.sns = new AWS.SNS();
          return from(
            this.sns
              .subscribe({
                Protocol: "sms",
                TopicArn: topic,
                Endpoint: this.phoneNormalize(endpoint),
                ReturnSubscriptionArn: false
              })
              .promise()
          );
        })
      );
    }
  }

  smsTopciUnSubscription(endpoint, topic) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        flatMap(credentials => {
          AWS.config.update({
            region: "us-east-1",
            credentials: credentials,
            apiVersions: {
              sns: "2010-03-31"
            }
          });

          this.sns = new AWS.SNS();
          return from(
            this.sns
              .subscribe({
                Protocol: "sms",
                TopicArn: topic,
                Endpoint: this.phoneNormalize(endpoint),
                ReturnSubscriptionArn: false
              })
              .promise()
          );
        })
      );
    }
  }

  emailTopciSubscription(endpoint, topic) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        flatMap(credentials => {
          AWS.config.update({
            region: "us-east-1",
            credentials: credentials,
            apiVersions: {
              sns: "2010-03-31"
            }
          });

          this.sns = new AWS.SNS();
          return from(
            this.sns
              .subscribe({
                Protocol: "email",
                TopicArn: topic,
                Endpoint: endpoint,
                ReturnSubscriptionArn: false
              })
              .promise()
          );
        })
      );
    }
  }

  private phoneNormalize(phone) {
    if (phone.toString().length === 9) {
      return "+213" + phone;
    } else if (phone.toString().length === 10) {
      return "+213" + phone.substring(1);
    } else if (phone.includes("00213")) {
      return "+" + phone.substring(2);
    } else if (phone.includes("+2130")) {
      return "+213" + phone.substring(5);
    }
  }
}
