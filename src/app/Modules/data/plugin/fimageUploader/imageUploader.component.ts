import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { from } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { CrudToolsService } from "src/app/private/crud/crud-tools.service";
import { S3Service } from "src/app/private/aws/s3.service";
import { AuthService } from "src/app/private/aws/auth.service";
import { ANIMATION_MODULE_TYPE } from "@angular/platform-browser/animations";
import { CrudService } from "src/app/private/firebase/crud.service";

@Component({
  selector: "app-imageUploader",
  templateUrl: "./imageUploader.component.html",
  styleUrls: ["./imageUploader.component.css"],
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
  @Input() path;
  @Input() config;
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private authService: AuthService,
    private __g_: CrudService,
    private ct: CrudToolsService
  ) {
    this.domain = localStorage.getItem("domain");
    this.user = this.authService.Cache.getItem("user");
  }

  ngOnInit() {
    if (this.config) {
      const objConfig = JSON.parse(this.config);

      this.name = objConfig.name;
      this.label = objConfig.label;
      this.bucket = objConfig.bucket;

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
      reader.onload = (e) => {
        this.image = (<any>e.target).result;
        this.imageSrc = input.target.files[0].name;
        this.size = input.target.files[0].size;
      };

      reader.readAsDataURL(input.target.files[0]);
    }
  }

  uploadImage() {
    let name = this.path + "/" + this.name + "/" + this.getImageName();

    this.__g_
      .putFileUrl(name, this.imagetoSend)
      .percentageChanges()
      .pipe(
        map((data) => {
          console.log(data);
          this.imageUpload = data;
        }),
        map((data: any) => {
          this.image = null;
          this.imageUpload = 0;
          return this.getImages();
        })
      )
      .subscribe((evt) => {
        let obj = {};
        obj[this.name] = name;
      });
  }

  getImages() {
    /*   let tmpArray = this.imagePath.split("/");
    let first = tmpArray.shift();
    let imagePath = "thumbnail/" + tmpArray.join("/");
*/

    this.images = this.images = this.__g_
      .getAllfiles(this.path + "/" + this.name + "/")
      .pipe(
        flatMap((data: any) => {
          let images = [];

          data.items.forEach((image) => {
            images.push(image.getDownloadURL());
          });

          return from(Promise.all(images));
        }),
        map((data) => {
          console.log(data);
          return data;
        })
      );
  }

  deleteImage(image) {}

  getImageName() {
    if (this.empty || this.n === 1) {
      return this.imageName;
    } else {
      return this.imageName + this.ct.makeID(12) + ".jpg";
    }
  }
}
