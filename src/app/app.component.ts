import {
  Component,
  Inject,
  APP_INITIALIZER,
  ApplicationInitStatus
} from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(@Inject(APP_INITIALIZER) public appInit: ApplicationInitStatus) {}
}
