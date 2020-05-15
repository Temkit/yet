import { Routes, RouterModule } from "@angular/router";
import { DataComponent } from "./data.component";

const routes: Routes = [
  {
    path: "",
    component: DataComponent,
    children: [
      {
        path: "form",
        loadChildren: () =>
          import("./Forms/formView/formView.module").then(
            (m) => m.FormViewModule
          ),
      },
      {
        path: "fform",
        loadChildren: () =>
          import("./Forms/fform/form.module").then((m) => m.FormModule),
      },
      {
        path: "cart",
        loadChildren: () =>
          import("./Lists/cartView/cartView.module").then(
            (m) => m.CartViewModule
          ),
      },
      {
        path: "commande",
        loadChildren: () =>
          import("./Forms/orderView/orderView.module").then(
            (m) => m.OrderViewModule
          ),
      },
      {
        path: "flist",
        loadChildren: () =>
          import("./Lists/flist/lists.module").then((m) => m.ListsModule),
      },
      {
        path: "list",
        loadChildren: () =>
          import("./Lists/lists/lists.module").then((m) => m.ListsModule),
      },
      {
        path: "social",
        loadChildren: () =>
          import("./Lists/apis/apis.module").then((m) => m.ApisModule),
      },
      {
        path: "users",
        loadChildren: () =>
          import("./Lists/users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "contact",
        loadChildren: () =>
          import("./Forms/contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "s/categories",
        loadChildren: () =>
          import("./Forms/s-category/s-category.module").then(
            (m) => m.SCategoryModule
          ),
      },
    ],
  },
];

export const DataRoutes = RouterModule.forChild(routes);
