import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { CrudToolsService } from "./crud-tools.service";
import { from } from "rxjs";
import Auth from "@aws-amplify/auth";
import { map, flatMap } from "rxjs/operators";
import * as AWS from "aws-sdk";
import { CacheService } from "./cache.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class UpdateService {
  isBrowser;

  constructor(
    private ct: CrudToolsService,
    private cacheService: CacheService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public update$(
    TableName,
    Key,
    UpdateExpression,
    ConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    region
  ) {
    if (this.isBrowser) {
      const cacheKey =
        "o" + this.ct.hashCode(TableName + JSON.stringify(Key) + region);

      return from(Auth.currentCredentials()).pipe(
        map(credentials => {
          AWS.config.update({
            region: "eu-central-1",
            credentials: credentials,
            apiVersions: {
              dynamodb: "2012-08-10"
            }
          });

          const documentClient = new AWS.DynamoDB.DocumentClient({
            region: region
          });

          const params = {
            TableName: TableName,
            Key: Key,
            UpdateExpression: UpdateExpression,
            ExpressionAttributeValues: ExpressionAttributeValues,
            ReturnValues: "UPDATED_NEW"
          };

          if (ExpressionAttributeNames) {
            (<any>params).ExpressionAttributeNames = ExpressionAttributeNames;
          }

          if (ConditionExpression) {
            (<any>params).ConditionExpression = ConditionExpression;
          }

          return documentClient.update(params).promise();
        }),
        flatMap(data => {
          this.cacheService.delete(cacheKey);
          return data;
        })
      );
    }
  }

  public updateConstructor$(tablename, key, attr?, region?) {
    if (this.isBrowser) {
      let UpdateExpression = "SET";
      const ExpressionAttributeNames = {};
      const ExpressionAttributeValues = {};

      Object.keys(attr).map(k => {
        const itemKey = "#" + k;
        const itemValue = ":" + k;

        if (
          attr[k] !== undefined &&
          attr[k] !== false &&
          attr[k] !== null &&
          attr[k] !== ""
        ) {
          UpdateExpression =
            UpdateExpression + " " + itemKey + " = " + itemValue + ",";
          ExpressionAttributeNames[itemKey] = k;
          ExpressionAttributeValues[itemValue] = attr[k];
        }
      });

      UpdateExpression = UpdateExpression.replace(new RegExp(",$"), "");
      UpdateExpression = UpdateExpression + " ";

      Object.keys(attr).map(key => {
        const itemKey = "#" + key;

        if (attr[key] === false) {
          UpdateExpression = UpdateExpression + "REMOVE " + itemKey + ",";
          ExpressionAttributeNames[itemKey] = key;
        }
      });

      UpdateExpression = UpdateExpression.replace(new RegExp(",$"), "");

      return this.update$(
        tablename,
        key,
        UpdateExpression,
        null,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        region
      ).pipe(
        map(data => {
          return data;
        })
      );
    }
  }
}
