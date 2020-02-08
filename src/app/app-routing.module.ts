import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./private/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "auth", component: AuthComponent },
  {
    path: "yet",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./Modules/dashbord.module").then(m => m.DashbordModule)
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
      enableTracing: false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
