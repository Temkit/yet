import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { map, retryWhen } from "rxjs/operators";
import { GenericRetryStrategyService } from "./../../../../../private/genericRetryStrategy.service";
@Component({
  selector: "app-additem",
  templateUrl: "./additem.component.html",
  styleUrls: ["./additem.component.css"]
})
export class AdditemComponent {
  objectConfig;
  domain;
  link;
  dummy;

  quantity: 0;
  product;
  taxes;
  constructor(
    public dialogRef: MatDialogRef<AdditemComponent>,
    private retry: GenericRetryStrategyService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
    this.dummy = new Date().getTime();

    if (this.data.value) {
      this.quantity = data.value.quantity;
      this.taxes = data.value.taxes;
      this.product = data.value.product;
    }

    this.objectConfig = this.http
      .get(
        "https://s3.eu-west-3.amazonaws.com/spec.yet.expert/" +
          this.domain +
          "/" +
          this.link +
          "/forms" +
          "/" +
          this.data.config.item +
          ".form.json?cache=" +
          new Date().getMilliseconds()
      )
      .pipe(
        retryWhen(this.retry.genericRetryStrategy()),
        map(data => {
          return data;
        })
      );
  }

  handleEvent(config, event) {
    this.product = event[config.name];
  }

  selectedTaxes(event) {
    this.taxes = event;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({
      taxes: this.taxes,
      quantity: this.quantity,
      product: this.product
    });
  }
}
