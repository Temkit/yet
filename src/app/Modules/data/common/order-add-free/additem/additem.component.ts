import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent {

  form = new FormGroup({
    label: new FormControl(''),
    price: new FormControl(''),
    quantity: new FormControl(''),
    taxes: new FormControl(''),
    description: new FormControl('<p></p>'),
  });

  constructor(
    public dialogRef: MatDialogRef<AdditemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  selectedTaxes(event) {
    this.form.patchValue({ taxes: event });
  }
  handleEditorEvent(event) {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(this.form.value);
  }

}
