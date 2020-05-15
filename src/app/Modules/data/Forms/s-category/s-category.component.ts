import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, flatMap } from "rxjs/operators";
import { S3Service } from "./../../../../private/aws/s3.service";

@Component({
  selector: "app-s-category",
  templateUrl: "./s-category.component.html",
  styleUrls: ["./s-category.component.css"],
})
export class SCategoryComponent implements OnInit {
  ready;
  domain;
  link;
  type;

  objectConfig = { specification: {} };
  constructor(private route: ActivatedRoute, private S3Service: S3Service) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {
    this.ready = this.route.queryParams.pipe(
      flatMap((params) => {
        this.objectConfig["specification"] = JSON.parse(
          JSON.stringify(params.item)
        );
        this.objectConfig["isChild"] = false;

        return this.S3Service.getSpec(
          this.domain +
            "/" +
            this.link +
            "/categories/" +
            params.item +
            ".form.json"
        );
      }),
      map((data: any) => {
        this.type = JSON.parse(data.Body.toString())?.type;
        console.log(this.type);
        return JSON.stringify(this.objectConfig);
      })
    );
  }

  save(z) {}
}
