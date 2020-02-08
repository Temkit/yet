import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponent } from './data.component';
import { FormsModule } from '@angular/forms';
import { DataRoutes } from './data.routing';

@NgModule({
  imports: [
    CommonModule, DataRoutes, FormsModule
  ],
  declarations: [DataComponent]
})
export class DataModule { }
