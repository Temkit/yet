import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageUploaderComponent } from "./imageUploader.component";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatChipsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  exports: [ImageUploaderComponent],
  entryComponents: [ImageUploaderComponent],
  declarations: [ImageUploaderComponent],
})
export class FImageUploaderModule {}
