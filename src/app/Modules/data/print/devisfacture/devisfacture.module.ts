import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DevisfactureComponent } from './devisfacture.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [DatePipe],
  exports: [DevisfactureComponent],
  declarations: [DevisfactureComponent]
})
export class DevisfactureModule { }
