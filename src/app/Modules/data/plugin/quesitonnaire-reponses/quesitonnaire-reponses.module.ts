import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuesitonnaireReponsesComponent } from "./quesitonnaire-reponses.component";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatFormFieldModule,
  MatListModule,
  MatExpansionModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSlideToggleModule
} from "@angular/material";
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
