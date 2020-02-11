import { Injectable } from "@angular/core";
import Amplify from "aws-amplify";
import { map } from "rxjs/operators";
import { S3Service } from "src/app/private/aws/s3.service";

@Injectable({
  providedIn: "root"
})
export class AppLoadService {
  constructor(private S3Service: S3Service) {}

  initializeApp(): Promise<any> {
    let host = "";

    host = window.location.host.toString().replace(".yet.marketing", "");

    // host = "mlm";
    // host = 'smartelectronicx.com';
    // host = 'transportachat.com';
    // host = 'apostrophe-ecole.dz';
    // host = 'robokids.tech' ;
    // host = "titanmedia.site";
    // host = "gest";
    // host = "oxygen";
    // host = "savitem";
    // host = "all-sticker.com";
    // host = "ritajmall";
    // host = "eyewear-algerie.com";
    // host = "krd";
    // host = "felyna";
    // host = "dkeere";
    // host = 'deluxe-marbre.com';
    // host = 'cbtpdz.com';
    // host = 'biomir.org';
    // host = 'dkeere.com';

    localStorage.setItem("domain", host);

    return this.S3Service.getSpec(host + "/spec.json")
      .pipe(
        map((data: any) => {
          localStorage.setItem("spec", data.Body.toString());
          Amplify.configure(JSON.parse(data.Body.toString()).credential.Auth);
          // Amplify.Logger.LOG_LEVEL = "DEBUG";
          return true;
        })
      )
      .toPromise();
  }
}
