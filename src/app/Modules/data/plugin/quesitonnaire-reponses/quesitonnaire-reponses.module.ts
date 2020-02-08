import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuesitonnaireReponsesComponent } from "./quesitonnaire-reponses.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AutocompleteModule } from "../../common/autocomplete/autocomplete.module";
import { ImageUploaderModule } from "../imageUploader/imageUploader.module";
import { GlobalModule } from "../../common/global/global.module";

@NgModule({
  imports: [
    CommonModule,
    GlobalModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AutocompleteModule,
    ImageUploaderModule,
    MatListModule,
    MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ],
  exports: [QuesitonnaireReponsesComponent],
  declarations: [QuesitonnaireReponsesComponent]
})
export class QuesitonnaireReponsesModule {}
