import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AutocompleteModule } from "../autocomplete/autocomplete.module";
import { DecoratorModule } from "../decorator/decorator.module";
import { ItemAddComponent } from "./item-add.component";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { AdditemModule } from "./additem/additem.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTabsModule,
    AdditemModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    AutocompleteModule,
    DecoratorModule
  ],
  exports: [ItemAddComponent],
  declarations: [ItemAddComponent]
})
export class ItemAddModule {}
