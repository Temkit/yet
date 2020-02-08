import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolygoneComponent } from './polygone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  exports: [PolygoneComponent],
  declarations: [PolygoneComponent]
})
export class PolygoneModule { }
