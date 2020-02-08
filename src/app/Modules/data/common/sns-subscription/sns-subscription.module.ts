import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnsSubscriptionComponent } from './sns-subscription.component';
import { FormsModule } from '@angular/forms';
import { FormMiniModule } from '../../Forms/form-mini/form-mini.module';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, MatTabsModule, MatTableModule } from '@angular/material';
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
