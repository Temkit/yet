import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsInputComponent } from './tagsInput.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  imports: [CommonModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule],
  exports: [TagsInputComponent],
  declarations: [TagsInputComponent]
})
export class TagsInputModule { }
