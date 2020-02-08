import { Routes, RouterModule } from "@angular/router";
import { DashbordComponent } from "./dashbord.component";

const routes: Routes = [
  {
    path: "",
    component: DashbordComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./dash/dash.module").then(m => m.DashModule)
      },
      {
        path: "data",
        loadChildren: () => import("./data/data.module").then(m => m.DataModule)
      },
      {
        path: "tools",
        loadChildren: () =>
          import("./tools/tools.module").then(m => m.ToolsModule)
      }
    ]
  }
];

export const YetRoutes = RouterModule.forChild(routes);
