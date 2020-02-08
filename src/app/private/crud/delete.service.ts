import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { CrudToolsService } from "./crud-tools.service";
import { from } from "rxjs";
import Auth from "@aws-amplify/auth";
import { map, flatMap } from "rxjs/operators";
import * as AWS from "aws-sdk";
import { CacheService } from "./cache.service";
import { UpdateService } from "./update.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class DeleteService {
  isBrowser;
  constructor(
    private ct: CrudToolsService,
    private __u_: UpdateService,
    private cacheService: CacheService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public delete$(TableName, Key, region) {
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
            Key: Key,
            TableName: TableName
          };
          return documentClient.delete(params).promise();
        }),
        flatMap(data => {
          this.cacheService.delete(cacheKey);
          return data;
        })
      );
    }
  }

  public trash$(TableName, Key, region) {
    if (this.isBrowser) {
      return this.__u_.updateConstructor$(
        TableName,
        Key,
        { active: 2 },
        region
      );
    }
  }
}
