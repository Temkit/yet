import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PickerComponent } from "./picker.component";
import { MatInputModule } from "@angular/material/input";
import { ColorPickerModule } from "ngx-color-picker";

@NgModule({
  imports: [CommonModule, FormsModule, MatInputModule, ColorPickerModule],
  exports: [PickerComponent],
  declarations: [PickerComponent],
})
export class PickerModule {}
