import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { from } from "rxjs";
import Auth from "@aws-amplify/auth";
import { map, flatMap } from "rxjs/operators";
import * as AWS from "aws-sdk";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class CreateService {
  isBrowser;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public create$(TableName, Item, region) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        map((credentials) => {
          AWS.config.update({
            region: "eu-central-1",
            credentials,
            apiVersions: {
              dynamodb: "2012-08-10",
            },
          });

          const documentClient = new AWS.DynamoDB.DocumentClient({
            region,
          });

          Object.keys(Item).map((key) => {
            if (typeof Item[key] === "string") {
              Item[key] = Item[key].toLowerCase();
            }

            if (Item[key] === "fine-grained-access") {
              Item[key] = credentials.identityId;
            }
          });

          if (!Item.hasOwnProperty("dat")) {
            Item.dat = new Date().getTime();
          }

          const params = {
            TableName,
            Item,
          };

          return documentClient.put(params).promise();
        }),
        flatMap((data) => {
          return data;
        })
      );
    }
  }

  public batchWrite$(TableName, Items, region) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        map((credentials) => {
          AWS.config.update({
            region: "eu-central-1",
            credentials: credentials,
            apiVersions: {
              dynamodb: "2012-08-10",
            },
          });

          const documentClient = new AWS.DynamoDB.DocumentClient({
            region: region,
          });

          let i, j, temparray;
          const chunk = 25;
          for (i = 0, j = Items.length; i < j; i += chunk) {
            temparray = Items.slice(i, i + chunk);

            const params = {
              RequestItems: {},
            };

            params.RequestItems[TableName] = [];

            Items.map((item) => {
              params.RequestItems[TableName].push({
                PutRequest: {
                  Item: item,
                },
              });
            });

            documentClient.batchWrite(params, function (err, data) {
              if (err) {
                console.log(err, err.stack);
              } else {
                console.log(data);
              }
            });
          }
        })
      );
    }
  }
}
