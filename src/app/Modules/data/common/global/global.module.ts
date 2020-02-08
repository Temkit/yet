import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalComponent } from './global.component';

@NgModule({
  imports: [
    CommonModule
  ], exports: [GlobalComponent],
  declarations: [GlobalComponent]
})
export class GlobalModule { }
