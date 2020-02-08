import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderAddFreeComponent } from './order-add-free.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatTableModule, MatDividerModule } from '@angular/material';

import { SelectModule } from '../select/select.module';
import { AdditemModule } from './additem/additem.module';
import { DecoratorModule } from '../decorator/decorator.module';
import { EditorModule } from '../../plugin/editor/editor.module';

@NgModule({
  imports: [CommonModule, FormsModule, DecoratorModule, MatTableModule, AdditemModule, EditorModule, MatDividerModule, SelectModule,
    ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule],
  exports: [OrderAddFreeComponent],
  declarations: [OrderAddFreeComponent]
})
export class OrderAddFreeModule { }
