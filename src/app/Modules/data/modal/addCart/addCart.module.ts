import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddCartComponent } from "./addCart.component";
import { FormsModule } from "@angular/forms";
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule
} from "@angular/material";
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
