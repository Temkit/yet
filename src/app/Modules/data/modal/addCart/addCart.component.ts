import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogComponent } from "../../common/dialog/dialog.component";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-addCart",
  templateUrl: "./addCart.component.html",
  styleUrls: ["./addCart.component.css"]
})
export class AddCartComponent {
  html;
  group;
  quantity = 0;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sanitizer: DomSanitizer
  ) {
    this.group = localStorage.getItem("group");
    this.html = this._sanitizer.bypassSecurityTrustHtml(this.data.content);
  }

  addQuantity() {
    this.quantity++;
  }

  subQuantity() {
    this.quantity--;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(total): void {
    this.dialogRef.close(total);
  }
}
