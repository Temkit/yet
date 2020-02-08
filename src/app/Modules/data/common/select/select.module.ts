import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectComponent } from "./select.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
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
