import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CartViewComponent } from "./cartView.component";
import { Routes, RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { DialogModule } from "../../common/dialog/dialog.module";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

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
