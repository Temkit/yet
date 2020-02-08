import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { QuestionnaireComponent } from './questionnaire.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutocompleteModule } from '../../common/autocomplete/autocomplete.module';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, AutocompleteModule, ImageUploaderModule, MatListModule,
    MatExpansionModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatSlideToggleModule,
  ], exports: [QuestionnaireComponent],
  declarations: [QuestionnaireComponent]
})
export class QuestionnaireModule { }
