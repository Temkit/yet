import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContactComponent } from "./contact.component";
import { Routes, RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
} from "@angular/material";

const routes: Routes = [{ path: "", component: ContactComponent }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactComponent]
})
export class ContactModule {}
