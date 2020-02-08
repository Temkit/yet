import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashbordComponent } from './dashbord.component';
import { FormsModule } from '../../../node_modules/@angular/forms';
import { YetRoutes } from './yet.routing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule, FormsModule, YetRoutes, MatBadgeModule, MatRippleModule, MatDividerModule,
    MatExpansionModule, MatButtonModule, MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule
  ],
  declarations: [DashbordComponent]
})
export class DashbordModule { }
