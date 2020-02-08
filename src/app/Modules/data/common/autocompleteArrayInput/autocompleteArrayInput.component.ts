import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { OneService } from "src/app/private/crud/one.service";
import { S3Service } from "./../../../../private/aws/s3.service";

@Component({
  selector: "app-autocompleteArrayInput",
  templateUrl: "./autocompleteArrayInput.component.html",
  styleUrls: ["./autocompleteArrayInput.component.css"]
})
export class AutocompleteArrayInputComponent implements OnInit {
  val;
  objectConfig;
  tableconfig;
  dataSource;
  source = [];
  tmp_product;
  domain;

  constructor(
    private http: HttpClient,
    private __o_: OneService,
    private S3Service: S3Service
  ) {
    this.domain = localStorage.getItem("domain");
  }

  ngOnInit() {}

  handleEvent(event) {
    this.tmp_product = event;
  }

  addProduct() {
    let key = JSON.parse(JSON.stringify(this.objectConfig.null));
    Object.keys(key).map(k => {
      if (key[k] == "undefined") {
        key[k] = this.tmp_product[k];
      }
    });
    this.source.push(
      this.__o_.one$(this.objectConfig.TableName, key, this.objectConfig.Region)
    );
    this.dataSource = forkJoin(this.source);
  }

  @Input()
  set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
      this.val = JSON.stringify(this.objectConfig.autocomplete);
      this.tableconfig = this.S3Service.getSpec(this.objectConfig.table).pipe(
        map((data: any) => {
          return JSON.parse(data.Body.toString());
        })
      );
    }
  }
}
