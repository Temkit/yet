import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectComponent } from "./select.component";
import {
  MatSelectModule,
  MatFormFieldModule,
  MatIconModule
} from "@angular/material";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule
  ],
  exports: [SelectComponent],
  declarations: [SelectComponent]
})
export class SelectModule {}
