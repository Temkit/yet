import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShowDataComponent } from "./showData.component";
import { DecoratorModule } from "../../common/decorator/decorator.module";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
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
