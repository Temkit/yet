import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent } from './imageUploader.component';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatProgressBarModule, MatIconModule, MatChipsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, FormsModule, MatInputModule, MatChipsModule, MatFormFieldModule, MatButtonModule, MatProgressBarModule, MatIconModule
  ], exports: [ImageUploaderComponent],
  entryComponents: [ImageUploaderComponent],
  declarations: [ImageUploaderComponent]
})
export class ImageUploaderModule { }
