import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogComponent } from "../../common/dialog/dialog.component";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-showData",
  templateUrl: "./showData.component.html",
  styleUrls: ["./showData.component.css"]
})
export class ShowDataComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sanitizer: DomSanitizer
  ) {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log(this.data);
  }
}
