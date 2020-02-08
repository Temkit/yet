import { ApisComponent } from "./apis.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Routes, RouterModule } from "@angular/router";
import { DecoratorModule } from "../../common/decorator/decorator.module";
import { TagsInputModule } from "../../common/tagsInput/tagsInput.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AutocompleteModule } from "../../common/autocomplete/autocomplete.module";
import { DialogModule } from "../../common/dialog/dialog.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SelectModule } from "../../common/select/select.module";
import { FormFilterModule } from "../../Forms/form-filter/form-filter.module";
import { AddCartModule } from "../../modal/addCart/addCart.module";
import { MatSortModule } from "@angular/material/sort";
import { ShowDataModule } from "../../modal/showData/showData.module";
import { StoreModule } from "@ngrx/store";
import { positionsReducer } from "./../../../../redux/reducers/list.reducer";

const routes: Routes = [{ path: "", component: ApisComponent }];

@NgModule({
  imports: [
    StoreModule.forRoot({ position: positionsReducer }),
    MatButtonModule,
    FormFilterModule,
    AddCartModule,
    ShowDataModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatDialogModule,
    MatInputModule,
    MatBottomSheetModule,
    DecoratorModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    TagsInputModule,
    DialogModule,
    MatSnackBarModule,
    AutocompleteModule,
    RouterModule.forChild(routes)
  ],
  exports: [MatSortModule],
  declarations: [ApisComponent]
})
export class ApisModule {}
