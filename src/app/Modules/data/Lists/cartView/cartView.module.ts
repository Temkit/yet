import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CartViewComponent } from "./cartView.component";
import { Routes, RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { DialogModule } from "../../common/dialog/dialog.module";
import {
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule
} from "@angular/material";

const routes: Routes = [{ path: "", component: CartViewComponent }];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    DialogModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CartViewComponent]
})
export class CartViewModule {}
