import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormComponent } from "./form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TagsInputModule } from "../../common/tagsInput/tagsInput.module";
import { AutocompleteModule } from "../../common/autocomplete/autocomplete.module";
import { PolygoneModule } from "../../common/polygone/polygone.module";
import { AutocompleteTagsInputModule } from "../../common/autocompletetagsInput/autocompleteTagsInput.module";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { OrderAddModule } from "../../common/order-add/order-add.module";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SimpleCategoryModule } from "../../common/simple-category/simple-category.module";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Routes } from "@angular/router";
import { ItemAddModule } from "../../common/item-add/item-add.module";
import { OrderAddFreeModule } from "../../common/order-add-free/order-add-free.module";
import { DevisfactureModule } from "../../print/devisfacture/devisfacture.module";
import { QuestionnaireModule } from "../../plugin/questionnaire/questionnaire.module";
import { ImageUploaderModule } from "../../plugin/fimageUploader/imageUploader.module";
import { EditorModule } from "../../plugin/editor/editor.module";
import { DateModule } from "../../common/date/date.module";
import { SnsSubscriptionModule } from "../../common/sns-subscription/sns-subscription.module";
import { CustomEmitModule } from "../../common/customEmit/customEmit.module";
import { LocationModule } from "../../common/location/location.module";
import { CognitoUserModule } from "../../common/cognitoUser/cognitoUser.module";
import { QuesitonnaireReponsesModule } from "../../plugin/quesitonnaire-reponses/quesitonnaire-reponses.module";
import { SelectModule } from "../../common/select/select.module";
import { PickerModule } from "../../common/color-picker/picker.module";

const routes: Routes = [{ path: "", component: FormComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    PickerModule,
    SnsSubscriptionModule,
    OrderAddModule,
    OrderAddFreeModule,
    DevisfactureModule,
    ItemAddModule,
    CustomEmitModule,
    QuesitonnaireReponsesModule,
    DateModule,
    PolygoneModule,
    AutocompleteTagsInputModule,
    QuestionnaireModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    ImageUploaderModule,
    TagsInputModule,
    MatCheckboxModule,
    LocationModule,
    MatSelectModule,
    SelectModule,
    AutocompleteModule,
    SimpleCategoryModule,
    EditorModule,
    CognitoUserModule,
    MatIconModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [FormComponent],
  declarations: [FormComponent],
})
export class FormModule {}
