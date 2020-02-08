import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdditemComponent } from "./additem.component";
import { AutocompleteModule } from "../../autocomplete/autocomplete.module";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { SelectModule } from "../../select/select.module";
import { FormsModule } from "@angular/forms";
import { FormMiniModule } from "../../../Forms/form-mini/form-mini.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormMiniModule,
    AutocompleteModule,
    MatFormFieldModule,
    SelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [AdditemComponent],
  entryComponents: [AdditemComponent],
  declarations: [AdditemComponent]
})
export class AdditemModule {}
