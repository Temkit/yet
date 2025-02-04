import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SCategoryComponent } from "./s-category.component";
import { Routes, RouterModule } from "@angular/router";
import { SimpleCategoryModule } from "../../common/simple-category/simple-category.module";
import { FSimpleCategoryModule } from "../../common/fsimple-category/simple-category.module";

const routes: Routes = [{ path: "", component: SCategoryComponent }];

@NgModule({
  imports: [
    CommonModule,
    SimpleCategoryModule,
    FSimpleCategoryModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SCategoryComponent],
})
export class SCategoryModule {}
