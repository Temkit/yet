import { S3Service } from "src/app/private/aws/s3.service";
import { Component, Output, EventEmitter, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OneService } from "src/app/private/crud/one.service";
import { of, empty } from "rxjs";

import findIndex from "lodash/findIndex";
import isEqual from "lodash/isEqual";
import { HttpClient } from "@angular/common/http";
import { AdditemComponent } from "./additem/additem.component";
import { SnsService } from "src/app/private/aws/sns.service";
import { AuthService } from "src/app/private/aws/auth.service";
import { flatMap, switchMap, map } from "rxjs/operators";

@Component({
  selector: "app-sns-subscription",
  templateUrl: "./sns-subscription.component.html",
  styleUrls: ["./sns-subscription.component.css"]
})
export class SnsSubscriptionComponent {
  domain;
  val;
  objectConfig;
  tableconfig;
  displayedColumns;
  dataSource;
  source$ = [];
  source = [];
  title;

  quantity;
  ref;
  total = 0;
  totalDisplay = "0";

  TopicARN = null;

  @Output() push: EventEmitter<object> = new EventEmitter<object>();

  @Input() set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
      this.tableconfig = this.S3Service.getSpec(this.objectConfig.table).pipe(
        map((data: any) => {
          return JSON.parse(data.Body.toString());
        })
      );
    }
  }

  @Input() set value(val) {
    if (val != null) {
      const config = JSON.parse(val);
      this.source = config.value;

      if (config.TopicARN === undefined || config.TopicARN === null) {
        this.sns
          .createTopic(
            this.objectConfig.topicName + new Date().getTime(),
            this.domain
          )
          .subscribe(
            data => {
              this.TopicARN = data;
            },
            err => {
              console.log(err);
            }
          );
        // if not topic arn even when contacts saved ...
      } else {
        this.TopicARN = config.TopicARN;
      }

      this.compileTable();
    }
  }

  tmp_product;
  constructor(
    private sns: SnsService,
    public dialog: MatDialog,
    private S3Service: S3Service
  ) {
    this.domain = localStorage.getItem("domain");
  }

  createItem(): void {
    const scope = this;

    let tmp;

    const dialogRef = this.dialog.open(AdditemComponent, {
      width: this.objectConfig["item-width"],
      height: this.objectConfig["item-height"],
      data: {
        config: {
          item: this.objectConfig.form
        },
        value: {}
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        flatMap(data => {
          tmp = data.item;

          if (data.item.phone) {
            return this.sns.smsTopciSubscription(
              data.item.phone,
              this.TopicARN
            );
          }

          return of(null);
        })
      )
      .subscribe((result: any) => {
        if (result) {
          tmp["subscriptionARN"] = result;
        }

        scope.source.push(tmp);
        scope.compileTable();
        scope.emit();
      });
  }

  private compileTable() {
    this.dataSource = of(this.source);
  }

  private emit() {
    let obj = {};
    obj[this.objectConfig.name] = {
      TopicARN: this.TopicARN,
      value: this.source
    };

    this.push.emit(obj);
  }

  delete(element) {
    const index = findIndex(this.source, function(item) {
      return isEqual(item, element);
    });
    (<Array<any>>this.source).splice(index, 1);
    this.compileTable();
    this.emit();
  }
}
