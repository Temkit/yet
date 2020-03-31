import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID, APP_INITIALIZER } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthModule } from "./auth/auth.module";
import { HttpClientModule } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import { AmplifyService } from "@flowaccount/aws-amplify-angular";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import localeFr from "@angular/common/locales/fr";

import { AppLoadService } from "src/app/private/appLoad.service";

registerLocaleData(localeFr, "fr_FR");

@NgModule({
  declarations: [AppComponent],
  imports: [
    AuthModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    BrowserModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppLoadService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: "fr_FR" },
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function initApp(AppLoadService: AppLoadService) {
  return () => AppLoadService.initializeApp();
}
