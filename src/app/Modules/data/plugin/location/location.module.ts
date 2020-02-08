import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location.component';
import { Routes, RouterModule } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: LocationComponent }
];

@NgModule({
  imports: [CommonModule, MatIconModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule.forChild(routes)],
  declarations: [LocationComponent]
})
export class LocationModule { }
