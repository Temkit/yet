import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = function() {};
    window.console.error = function() {};
    window.console.info = function() {};
    window.console.debug = function() {};
    window.console.warn = function() {};
    window.console.trace = function() {};
    window.console.dir = function() {};
    window.console.dirxml = function() {};
    window.console.group = function() {};
    window.console.groupEnd = function() {};
    window.console.time = function() {};
    window.console.timeEnd = function() {};
    window.console.assert = function() {};
    window.console.profile = function() {};
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
