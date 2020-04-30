import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EditorComponent } from "./editor.component";
import { FormsModule } from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

@NgModule({
  imports: [CommonModule, FormsModule, CKEditorModule],
  exports: [EditorComponent],
  declarations: [EditorComponent],
})
export class EditorModule {}
