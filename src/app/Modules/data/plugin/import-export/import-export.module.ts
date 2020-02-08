import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportExportComponent } from './import-export.component';

@NgModule({
  imports: [
    CommonModule
  ], exports: [ImportExportComponent],
  entryComponents: [ImportExportComponent],
  declarations: [ImportExportComponent]
})
export class ImportExportModule { }
