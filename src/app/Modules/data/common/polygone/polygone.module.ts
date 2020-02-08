import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolygoneComponent } from './polygone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  exports: [PolygoneComponent],
  declarations: [PolygoneComponent]
})
export class PolygoneModule { }
