import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { from } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { CrudToolsService } from "src/app/private/crud/crud-tools.service";
import { S3Service } from "src/app/private/aws/s3.service";
import { AuthService } from "src/app/private/aws/auth.service";
import { ANIMATION_MODULE_TYPE } from "@angular/platform-browser/animations";

@Component({
  selector: "app-imageUploader",
  templateUrl: "./imageUploader.component.html",
  styleUrls: ["./imageUploader.component.css"]
})
export class ImageUploaderComponent implements OnInit {
  image = null;
  imageUpload = 0;
  imagetoSend;
  imageSrc;
  region;
  chargement;
  label;
  displayUpload = false;

  domain;
  imagePath;
  _id;
  user;

  bucket;
  name;
  images;
  empty = false;

  file_resume = null;
  fileupload = 0;
  done;
  min_w = 300;

  cache;

  imageName;
  n;
  height;
  background;
  class;

  size;

  @Input() value;
  @Input() config;
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private s3Service: S3Service,
    private authService: AuthService,
    private ct: CrudToolsService
  ) {
    this.domain = localStorage.getItem("domain");
    this.user = this.authService.Cache.getItem("user");
  }

  ngOnInit() {
    if (this.value) {
      this._id = this.value;
    } else {
      this._id = this.ct
        .makeID(8)
        .toString()
        .toLowerCase();
    }

    if (this.config) {
      const objConfig = JSON.parse(this.config);

      this.name = objConfig.name;
      this.label = objConfig.label;
      this.bucket = objConfig.bucket;
      this.region = objConfig.Region;
      this.imagePath = objConfig.imagePath;
      this.imageName = objConfig.imageName;
      this.n = objConfig.n;
      this.height = objConfig.height;
      this.background = objConfig.background;
      this.class = objConfig.classimg;
      this.getImages();
    }
  }

  readURL(input) {
    if (input.target.files && input.target.files[0]) {
      this.displayUpload = true;
      const reader = new FileReader();
      this.imagetoSend = input.target.files[0];
      reader.onload = e => {
        this.image = (<any>e.target).result;
        this.imageSrc = input.target.files[0].name;
        this.size = input.target.files[0].size;
      };

      reader.readAsDataURL(input.target.files[0]);
    }
  }

  uploadImage() {
    this.s3Service
      .upload(
        this.region,
        this.bucket,
        this.imagetoSend,
        this.getImageName(),
        this.imagePath + this._id + "/",
        {}
      )
      .subscribe((uploader: any) => {
        uploader
          .on("httpUploadProgress", evt => {
            this.imageUpload = (evt.loaded / evt.total) * 100;

            console.log(this.imageUpload);
          })
          .send((err, data) => {
            if (err) {
              console.log(err);
            } else {
              this.image = null;
              this.imageUpload = 0;
              this.getImages();

              let obj = {};
              obj[this.name] = this._id;

              this.patch.emit(obj);
            }
          });
      });
  }

  deleteImage(image) {
    this.s3Service
      .delete(this.region, this.bucket, image.Key)
      .subscribe(data => {
        this.getImages();
      });
  }

  getImages() {
    /*   let tmpArray = this.imagePath.split("/");
    let first = tmpArray.shift();
    let imagePath = "thumbnail/" + tmpArray.join("/");
*/

    this.images = from(
      this.s3Service.get(
        this.region,
        this.bucket,
        this.imagePath + this._id + "/"
      )
    ).pipe(
      flatMap((data: any) => {
        return from(data);
      }),
      map((imgs: Array<any>) => {
        const data = [];
        imgs.map(i => {
          i.src =
            "https://s3.eu-west-3.amazonaws.com/" +
            this.bucket +
            "/" +
            i.Key +
            "?dummy=" +
            this.ct.id(12);

          data.push(i);
        });

        this.empty = data.length === 0 ? true : false;
        return data;
      })
    );
  }

  getImageName() {
    if (this.empty || this.n === 1) {
      return this.imageName;
    } else {
      return this.imageName + this.ct.makeID(12) + ".jpg";
    }
  }
}
// "https://s3.eu-west-3.amazonaws.com/img.yet.expert/yet/ritajmall.com/marque/logo/1plrrlk/ritajmall.com.marque.logo.jpg?dummy="
// "https://s3.eu-west-3.amazonaws.com/img.yet.expert/yet/ritajmall.com/marque/logo/1plrrlk/ritajmall.com.marque.logo.jpg?dummy=114510780131521400"
// "https://s3.eu-west-3.amazonaws.com/img.yet.expert/yet/ritajmall.com/marque/logo/1plrrlk/ritajmall.com.marque.logo.jpg"
