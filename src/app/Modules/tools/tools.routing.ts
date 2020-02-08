import { Routes, RouterModule } from "@angular/router";
import { ToolsComponent } from "./tools.component";

const routes: Routes = [
  {
    path: "",
    component: ToolsComponent,
    children: [
      {
        path: "sms",
        loadChildren: () => import("./sms/sms.module").then(m => m.SmsModule),
        runGuardsAndResolvers: "always"
      },
      {
        path: "email",
        loadChildren: () =>
          import("./email/email.module").then(m => m.EmailModule)
      },
      {
        path: "consumption",
        loadChildren: () =>
          import("./consumption/consumption.module").then(
            m => m.ConsumptionModule
          ),
        runGuardsAndResolvers: "always"
      }
    ]
  }
];

export const ToolsRoutes = RouterModule.forChild(routes);
