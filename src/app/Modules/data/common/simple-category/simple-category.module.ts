import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleCategoryComponent } from './simple-category.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, MatButtonModule } from '@angular/material';
import { AdditemModule } from './additem/additem.module';
@NgModule({
  imports: [
    CommonModule, MatTreeModule, AdditemModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, MatButtonModule
  ], exports: [SimpleCategoryComponent],
  declarations: [SimpleCategoryComponent]
})
export class SimpleCategoryModule { }
