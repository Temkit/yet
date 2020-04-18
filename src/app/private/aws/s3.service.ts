import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import * as AWS from "aws-sdk";
import { Observable, from } from "rxjs";
import { Auth } from "aws-amplify";
import { map } from "rxjs/operators";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class S3Service {
  isBrowser;
  creds;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.creds = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "eu-central-1:31394830-9e7b-40b8-8216-9e9a98eaa277",
    });
  }

  getMetadata(region, IdentityPoolId, bucketName, file, metadata) {
    if (this.isBrowser) {
      AWS.config.update({
        region,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId,
        }),
      });

      return Observable.create((Observer) => {
        Auth.currentCredentials().then((credentials) => {
          const s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            credentials: Auth.essentialCredentials(credentials),
            params: {
              Bucket: bucketName,
              Key: file.name,
              Body: file,
              ACL: "public-read",
              Metadata: metadata,
            },
          });

          s3.headObject(
            {
              Bucket: bucketName,
              Key: file.name,
            },
            function (err, data) {
              if (err) {
                console.log(err, err.stack);
              } else {
                Observer.next(data);
              }
            }
          );
        });
      });
    }
  }

  getSpec(key) {
    return new Observable((observer) => {
      AWS.config.region = "eu-central-1";

      console.log(key);
      this.creds.clearCachedId();

      AWS.config.update({
        credentials: this.creds,
      });

      let s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        region: "eu-west-3",
      });

      s3.getObject(
        {
          Bucket: "spec.yet.expert",
          Key: key,
        },
        (err, resp) => {
          if (err) {
            console.log(err);
            observer.error(err);
            observer.complete();
          } else {
            observer.next(resp);
            observer.complete();
          }
        }
      );
    });

    /*   return from(Auth.currentCredentials()).pipe(
        map(credentials => {
          const s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            region: "eu-west-3",
            credentials: Auth.essentialCredentials(credentials),
            params: {
              Bucket: "spec.yet.expert",
              Key: key
            }
          });

          return new Promise((resolve, reject) => {
            s3.getObject(
              { Bucket: "spec.yet.expert", Key: key },
              (err, resp) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  console.log(resp);
                  resolve(resp);
                }
              }
            );
          });
        })
      ); */
  }

  get(region, bucketName, prefix) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        map((credentials) => {
          const s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            region: region,
            credentials: Auth.essentialCredentials(credentials),
            params: {
              Bucket: bucketName,
              Prefix: prefix,
              StartAfter: prefix + "/",
            },
          });

          return new Promise(function (resolve, reject) {
            s3.listObjectsV2(
              { Bucket: bucketName, Prefix: prefix, StartAfter: prefix + "/" },
              function (err, resp) {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  resolve(resp.Contents);
                }
              }
            );
          });
        })
      );
    }
  }

  delete(region, bucketName, Key) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        map((credentials) => {
          const s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            region: region,
            credentials: Auth.essentialCredentials(credentials),
            params: {
              Bucket: bucketName,
              Key: Key,
            },
          });

          s3.deleteObject(
            {
              Bucket: bucketName,
              Key: Key,
            },
            function (err) {
              if (err) {
                console.log(err, err.stack);
              }

              return err;
            }
          );
        })
      );
    }
  }

  upload(region, bucketName, file, name, prefix, metadata) {
    if (this.isBrowser) {
      return from(Auth.currentCredentials()).pipe(
        map((credentials) => {
          AWS.config.update({
            region: region,
            credentials: credentials,
            httpOptions: {
              timeout: 0,
            },
          });

          const part = 10;
          const queue = Math.round(file.size / (part * 1024 * 1024)) / 2;

          return new AWS.S3.ManagedUpload({
            partSize: part * 1024 * 1024,
            queueSize: queue,
            params: {
              Bucket: bucketName,
              Key: prefix + name,
              Body: file,
              ACL: "public-read",
              CacheControl: "max-age=31536000",
            },
          });
        })
      );
    }
  }
}
