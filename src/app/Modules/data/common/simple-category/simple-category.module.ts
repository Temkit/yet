import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleCategoryComponent } from './simple-category.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AdditemModule } from './additem/additem.module';
@NgModule({
  imports: [
    CommonModule, MatTreeModule, AdditemModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, MatButtonModule
  ], exports: [SimpleCategoryComponent],
  declarations: [SimpleCategoryComponent]
})
export class SimpleCategoryModule { }
