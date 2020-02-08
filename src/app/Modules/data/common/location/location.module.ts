import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, MatIconModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  exports: [LocationComponent],
  declarations: [LocationComponent]
})
export class LocationModule { }
