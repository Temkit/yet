import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { from } from "rxjs";
import Auth from "@aws-amplify/auth";
import { map, flatMap } from "rxjs/operators";
import * as AWS from "aws-sdk";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class OneService {
  isBrowser;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public one$(TableName, Key, region, AttributesToGet?) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        map(credentials => {
          AWS.config.update({
            region: "eu-central-1",
            credentials: credentials,
            apiVersions: {
              dynamodb: "2012-08-10"
            }
          });

          Object.keys(Key).map(k => {
            if (Key[k] === "fine-grained-access") {
              Key[k] = credentials.identityId;
            }
          });

          const documentClient = new AWS.DynamoDB.DocumentClient({
            region: region
          });
          const params = {
            TableName: TableName,
            Key: Key
          };

          if (AttributesToGet && AttributesToGet.length > 0) {
            params["AttributesToGet"] = AttributesToGet;
          }

          return documentClient.get(params).promise();
        }),
        flatMap((data: any) => {
          return data;
        }),
        map((data: any) => {
          return data.Item;
        })
      );
    }
  }
}
