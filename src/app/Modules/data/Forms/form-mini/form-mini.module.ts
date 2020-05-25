import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TagsInputModule } from "../../common/tagsInput/tagsInput.module";
import { AutocompleteModule } from "../../common/autocomplete/autocomplete.module";
import { AutocompleteTagsInputModule } from "../../common/autocompletetagsInput/autocompleteTagsInput.module";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { FormMiniComponent } from "./form-mini.component";
import { ImageUploaderModule } from "../../plugin/fimageUploader/imageUploader.module";
import { EditorModule } from "../../plugin/editor/editor.module";
import { QuestionnaireModule } from "../../plugin/questionnaire/questionnaire.module";
import { DateModule } from "../../common/date/date.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { SelectModule } from "../../common/select/select.module";
import { PickerModule } from "../../common/color-picker/picker.module";

@NgModule({
  imports: [
    CommonModule,
    PickerModule,
    FormsModule,
    DateModule,
    SelectModule,
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
  ],
  exports: [FormMiniComponent],
  declarations: [FormMiniComponent],
})
export class FormMiniModule {}
