import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnsSubscriptionComponent } from './sns-subscription.component';
import { FormsModule } from '@angular/forms';
import { FormMiniModule } from '../../Forms/form-mini/form-mini.module';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectModule } from '../select/select.module';
import { DecoratorModule } from '../decorator/decorator.module';
import { AdditemModule } from './additem/additem.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, MatIconModule, MatTabsModule, AdditemModule,
    MatFormFieldModule, MatTableModule, MatInputModule, MatButtonModule, AutocompleteModule, DecoratorModule
  ], exports: [SnsSubscriptionComponent],
  declarations: [SnsSubscriptionComponent]
})
export class SnsSubscriptionModule { }
