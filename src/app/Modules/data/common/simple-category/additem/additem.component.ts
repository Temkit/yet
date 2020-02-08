import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent {

  change = false;

  constructor(
    public dialogRef: MatDialogRef<AdditemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  item;

  save(event) {
    this.item = event;
    this.change = true;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    if (this.change) {
      this.dialogRef.close({ origine: this.data.origine, item: this.item });
    } else {
      this.dialogRef.close();
    }
  }

}
