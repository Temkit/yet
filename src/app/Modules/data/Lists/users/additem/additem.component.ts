import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl } from "@angular/forms";
import { CognitoService } from "src/app/private/aws/cognito.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-additem",
  templateUrl: "./additem.component.html",
  styleUrls: ["./additem.component.css"]
})
export class AdditemComponent {
  user = new FormGroup({
    name: new FormControl(""),
    company: new FormControl(""),
    username: new FormControl(""),
    phone: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),
    group: new FormControl("")
  });

  groups;

  constructor(
    public dialogRef: MatDialogRef<AdditemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cognito: CognitoService
  ) {
    this.groups = this.cognito.listGroup().pipe(
      map((data: any) => {
        return data.Groups;
      })
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(this.user.value);
  }
}
