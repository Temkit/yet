import { Component, OnInit } from "@angular/core";
import { S3Service } from "src/app/private/aws/s3.service";

@Component({
  selector: "app-import-export",
  templateUrl: "./import-export.component.html",
  styleUrls: ["./import-export.component.css"]
})
export class ImportExportComponent implements OnInit {
  filetoSend;
  fileUpload = 0;

  constructor(private s3Service: S3Service) {}

  ngOnInit() {}

  import() {
    const scope = this;
    this.s3Service
      .upload(
        "eu-central-1",
        "s3.eu-west-3.amazonaws.com/img.yet.expert",
        this.filetoSend,
        "import",
        "/",
        {}
      )
      .subscribe((uploader: any) => {
        uploader
          .on("httpUploadProgress", function(evt) {
            scope.fileUpload = (evt.loaded / evt.total) * 100;
          })
          .send(function(err, data) {
            console.log("lambda");
          });
      });
  }

  readURL(input) {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      this.filetoSend = input.target.files[0];
    }
  }
}
