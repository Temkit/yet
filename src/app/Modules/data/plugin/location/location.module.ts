import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LocationComponent } from "./location.component";
import { Routes, RouterModule } from "@angular/router";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [{ path: "", component: LocationComponent }];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LocationComponent],
})
export class LocationModule {}
