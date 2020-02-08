import { SanitizePipe } from "./../../../../private/pipes/sanitize.pipe";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DecoratorComponent } from "./decorator.component";
import { FormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule
  ],
  exports: [DecoratorComponent],
  declarations: [DecoratorComponent, SanitizePipe]
})
export class DecoratorModule {}
