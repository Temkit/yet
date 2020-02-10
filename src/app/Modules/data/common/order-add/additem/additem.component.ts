import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { map } from "rxjs/operators";
import { S3Service } from "./../../../../../private/aws/s3.service";
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
    private S3Service: S3Service,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
    this.dummy = new Date().getTime();

    if (this.data.value) {
      this.quantity = data.value.quantity;
      this.taxes = data.value.taxes;
      this.product = data.value.product;
    }

    this.objectConfig = this.S3Service.getSpec(
      this.domain +
        "/" +
        this.link +
        "/forms" +
        "/" +
        this.data.config.item +
        ".form.json"
    ).pipe(
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
