import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './tools.component';
import { ToolsRoutes } from './tools.routing';

@NgModule({
  imports: [
    CommonModule, ToolsRoutes
  ],
  declarations: [ToolsComponent]
})
export class ToolsModule { }
