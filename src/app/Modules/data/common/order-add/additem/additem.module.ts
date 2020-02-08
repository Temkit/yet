import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdditemComponent } from "./additem.component";
import { FormsModule } from "@angular/forms";
import { FormMiniModule } from "../../../Forms/form-mini/form-mini.module";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { AutocompleteModule } from "../../autocomplete/autocomplete.module";
import { SelectModule } from "../../select/select.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormMiniModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    AutocompleteModule,
    SelectModule
  ],
  exports: [AdditemComponent],
  entryComponents: [AdditemComponent],
  declarations: [AdditemComponent]
})
export class AdditemModule {}
