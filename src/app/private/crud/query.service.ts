import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { CrudToolsService } from "./crud-tools.service";
import * as AWS from "aws-sdk";
import { from, forkJoin, of, empty } from "rxjs";
import Auth from "@aws-amplify/auth";
import { map, flatMap } from "rxjs/operators";
import { CacheService } from "./cache.service";
import { isPlatformBrowser } from "@angular/common";
import { orderBy } from "lodash";

@Injectable({
  providedIn: "root",
})
export class QueryService {
  isBrowser;
  constructor(
    private ct: CrudToolsService,
    private cacheService: CacheService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // AWS.config.logger = console;
  }

  public query$(
    type,
    TableName,
    IndexName,
    KeyConditionExpression,
    ProjectionExpression,
    FilterExpression,
    ExpressionAttributeNames,
    ExpressionAttributeNames_Additional,
    ExpressionAttributeValues,
    limit,
    lastEvaluatedKey,
    ScanIndexForward,
    region,
    sort,
    cached
  ) {
    if (this.isBrowser) {
      if (ExpressionAttributeValues) {
        console.log(ExpressionAttributeValues);
        Object.keys(ExpressionAttributeValues).map((key) => {
          if (
            ExpressionAttributeValues[key] &&
            ExpressionAttributeValues[key].toString().includes("cache|")
          ) {
            let eavk = ExpressionAttributeValues[key];

            ExpressionAttributeValues[key] =
              eavk.replace(/cache\|.*/g, "") +
              localStorage.getItem(
                eavk.replace(/.*cache\|/g, "").replace(/\>\>.*/g, "")
              ) +
              eavk.replace(/.*\>\>/g, "");
          }
        });
      }

      const params = {
        TableName,
        KeyConditionExpression,
        ProjectionExpression,
        FilterExpression,
        ExpressionAttributeNames: Object.assign(
          {},
          ExpressionAttributeNames,
          ExpressionAttributeNames_Additional
        ),
        ExpressionAttributeValues,
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: false,
      };

      if (IndexName) {
        params["IndexName"] = IndexName;
      }

      console.log(params);

      const cacheKey =
        "q" +
        this.ct.hashCode(
          TableName +
            IndexName +
            KeyConditionExpression +
            ProjectionExpression +
            FilterExpression +
            limit +
            JSON.stringify(lastEvaluatedKey) +
            JSON.stringify(ExpressionAttributeValues) +
            ScanIndexForward
        );

      if (!cached) {
        this.cacheService.delete(cacheKey);
      }

      return this.cacheService.get(
        cacheKey,
        from(Auth.currentUserCredentials()).pipe(
          map((credentials) => {
            AWS.config.update({
              region: "eu-central-1",
              credentials: credentials,
              apiVersions: {
                dynamodb: "2012-08-10",
              },
            });

            Object.keys(params.ExpressionAttributeValues).map((key) => {
              if (
                params.ExpressionAttributeValues[key] === "fine-grained-access"
              ) {
                params.ExpressionAttributeValues[key] = credentials.identityId;
              }
            });

            const documentClient = new AWS.DynamoDB.DocumentClient({
              region: region,
            });

            if (type === "query") {
              return documentClient.query(params).promise();
            } else {
              return documentClient.scan(params).promise();
            }
          }),
          flatMap((data) => {
            return data;
          }),
          flatMap((data: any) => {
            if (sort && sort.length > 0) {
              data.Items =
                data.Items.length > 0
                  ? orderBy(data.Items, [sort[0]], [sort[1]])
                  : [];
            }

            return forkJoin([
              of(data),
              this.count$(
                TableName,
                region,
                IndexName,
                KeyConditionExpression,
                FilterExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues
              ),
            ]);
          }),
          map((data: any) => {
            data[0]["Count"] = data[1].Count;
            return data[0];
          })
        )
      );
    }
  }

  public count$(
    TableName,
    region,
    IndexName,
    KeyConditionExpression,
    FilterExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  ) {
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

          Object.keys(ExpressionAttributeValues).map((key) => {
            if (ExpressionAttributeValues[key] === "fine-grained-access") {
              ExpressionAttributeValues[key] = credentials.identityId;
            }
          });

          const documentClient = new AWS.DynamoDB.DocumentClient({
            region: region,
          });

          Object.keys(ExpressionAttributeValues).map((key) => {
            if (
              ExpressionAttributeValues[key] &&
              ExpressionAttributeValues[key].toString().includes("cache|")
            ) {
              ExpressionAttributeValues[key] =
                ExpressionAttributeValues[key].replace(/cache\|.*/g, "") +
                localStorage.getItem(
                  ExpressionAttributeValues[key]
                    .replace(/.*cache\|/g, "")
                    .replace(/\>\>.*/g, "")
                ) +
                ExpressionAttributeValues[key].replace(/.*(\>\>)?/g, "");
            }
          });

          const params = {
            TableName,
            FilterExpression,
            KeyConditionExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            Select: "COUNT",
            Limit: null,
          };

          if (IndexName) {
            params["IndexName"] = IndexName;
          }

          return documentClient.query(params).promise();
        }),
        flatMap((data) => {
          return data;
        })
      );
    }
  }
}
