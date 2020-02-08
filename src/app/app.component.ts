import {
  Component,
  Inject,
  APP_INITIALIZER,
  ApplicationInitStatus
} from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(@Inject(APP_INITIALIZER) public appInit: ApplicationInitStatus) {}
}

/*{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllObjectActions",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:*Object",
            "Resource": "arn:aws:s3:::spec.yet.expert/*"
        }
    ]
}*/

/* <?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>Authorization</AllowedHeader>
</CORSRule>
</CORSConfiguration> */
