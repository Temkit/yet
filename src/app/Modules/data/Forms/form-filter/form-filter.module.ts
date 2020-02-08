import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateModule } from "../../common/date/date.module";
import { AutocompleteTagsInputModule } from "../../common/autocompletetagsInput/autocompleteTagsInput.module";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
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
