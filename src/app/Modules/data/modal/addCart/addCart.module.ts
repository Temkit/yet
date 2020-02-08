import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddCartComponent } from "./addCart.component";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { DecoratorModule } from "./../../common/decorator/decorator.module";

@NgModule({
  imports: [
    CommonModule,
    DecoratorModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [AddCartComponent],
  entryComponents: [AddCartComponent],
  declarations: [AddCartComponent]
})
export class AddCartModule {}
