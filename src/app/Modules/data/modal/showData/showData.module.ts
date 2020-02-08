import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShowDataComponent } from "./showData.component";
import { DecoratorModule } from "../../common/decorator/decorator.module";
import {
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
} from "@angular/material";
import { FormsModule } from "@angular/forms";

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
  exports: [ShowDataComponent],
  entryComponents: [ShowDataComponent],
  declarations: [ShowDataComponent]
})
export class ShowDataModule {}
