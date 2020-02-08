import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateModule } from "../../common/date/date.module";
import { AutocompleteTagsInputModule } from "../../common/autocompletetagsInput/autocompleteTagsInput.module";
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatIconModule,
  MatTabsModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule
} from "@angular/material";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { ImageUploaderModule } from "../../plugin/imageUploader/imageUploader.module";
import { TagsInputModule } from "../../common/tagsInput/tagsInput.module";
import { AutocompleteModule } from "../../common/autocomplete/autocomplete.module";
import { EditorModule } from "../../plugin/editor/editor.module";
import { RouterModule } from "@angular/router";
import { QuestionnaireModule } from "../../plugin/questionnaire/questionnaire.module";
import { FormFilterComponent } from "./form-filter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    DateModule,
    AutocompleteTagsInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    ImageUploaderModule,
    TagsInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    AutocompleteModule,
    EditorModule,
    MatIconModule,
    RouterModule,
    QuestionnaireModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDaterangepickerMd.forRoot()
  ],
  exports: [FormFilterComponent],
  declarations: [FormFilterComponent]
})
export class FormFilterModule {}
