import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogComponent } from "./dialog.component";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [DialogComponent],
  entryComponents: [DialogComponent],
  declarations: [DialogComponent]
})
export class DialogModule {}
