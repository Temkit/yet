import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashComponent } from "./dash.component";
import { Routes, RouterModule } from "@angular/router";
import { GlobalModule } from "../data/common/global/global.module";

const routes: Routes = [{ path: "", component: DashComponent }];

@NgModule({
  imports: [
    CommonModule,
    GlobalModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashComponent]
})
export class DashModule {}
