import { Component, OnInit } from "@angular/core";
import { map, flatMap } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { S3Service } from "./../../../../private/aws/s3.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ListVars } from "src/app/private/interfaces/list.vars";
import { CognitoService } from "src/app/private/aws/cognito.service";
import { AdditemComponent } from "./additem/additem.component";
import { DialogComponent } from "../../common/dialog/dialog.component";
import { empty } from "rxjs";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  vars = {
    FormElements: [],
    Positions: [],
    Position_ref: 0,
    Specification: {},
    Index: 0,
    Filters: {},
    delete: {},
    Count: 0,
  } as ListVars;

  Filter = "";
  filterForm;
  name;
  FilterOpenState = false;
  group;
  link;

  items;
  tokens = [null];
  lastTokenid = 0;

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private S3Service: S3Service,
    public snackBar: MatSnackBar,
    private cognito: CognitoService,
    public dialog: MatDialog
  ) {
    this.link = localStorage.getItem("group");
  }

  panelOpenState = false;

  togglePanel() {
    this.FilterOpenState = !this.FilterOpenState;
  }

  openBottomSheet(): void {
    // this.bottomSheet.open(ImportExportComponent);
  }

  ngOnInit() {
    this.vars.Items = this.router.queryParams.pipe(
      flatMap((params) => {
        this.vars.File = params.item;
        this.vars.Domain = localStorage.getItem("domain");

        return this.S3Service.getSpec(
          this.vars.Domain +
            "/" +
            this.link +
            "/lists/" +
            this.vars.File +
            ".list.json"
        );
      }),
      flatMap((spec: any) => {
        let data = JSON.parse(spec.Body.toString());

        this.name = data.name;
        this.vars.Specification = data;
        this.vars.title = data.title;
        this.vars.subtitle = data.subtitle;
        this.vars.addLabel = data.addLabel;
        this.vars.Limit = data.Limit;

        if (data.filtres && Object.keys(data.filtres).length > 0) {
          this.filterForm = data.filtres;
        }
        this.initFilters();

        return this.setlistData();
      })
    );
  }

  setlistData() {
    return this.cognito
      .listUsers(
        this.vars.Specification.UserPoolId,
        this.vars.Specification.attributes.keys_data,
        this.vars.Limit,
        this.Filter,
        this.tokens[this.lastTokenid]
      )
      .pipe(
        map((data: any) => {
          this.vars.Count = data.Count;
          this.tokens.push(data.PaginationToken);

          return data.users;
        })
      );
  }

  initFilters() {
    const formObject = {};
    this.vars.Specification["filtres"].map((property: any) => {
      formObject[property.name] = new FormControl({
        value: null,
        disabled: property.disabled,
      });
      this.vars.FormElements.push(formObject[property.name]);
      this.vars.Filters[property.name] = JSON.stringify(property);
    });

    this.vars.Form = new FormGroup(formObject);
  }

  handlePage(event) {
    if (event.pageSize !== this.vars.Limit) {
      this.vars.Limit = event.pageSize;
    } else if (event.previousPageIndex > event.pageIndex) {
    } else if (event.previousPageIndex < event.pageIndex) {
    }
  }

  goto(item) {
    let queryParams;

    if (this.vars.Specification.QueryParams) {
      queryParams = JSON.parse(
        JSON.stringify(this.vars.Specification.QueryParams)
      );
      Object.keys(queryParams).map((key) => {
        if (queryParams[key] === "undefined") {
          queryParams[key] = item[key];
        }
      });
    } else {
      queryParams = { item: this.vars.File, id: item["_id"] };
    }

    this.route.navigate([this.vars.Specification.Link], {
      queryParams: queryParams,
    });
  }

  refresh() {
    const values = Object.keys(localStorage)
      .filter((key) => key.startsWith(this.vars.File))
      .map((key) => {
        delete localStorage[key];
      });

    this.setlistData();
  }

  filter(e, filterName, FilterOperation) {
    this.Filter = filterName + FilterOperation.replace("{{S}}", e);
    this.setlistData();
  }

  createUser(): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
      width: "650px",
      height: "650px",
      data: null,
    });

    dialogRef
      .afterClosed()
      .pipe(
        flatMap((data) => {
          if (data) {
            return this.cognito.createUser(
              data.name,
              data.company,
              data.email,
              data.phone,
              "EMAIL",
              data.password,
              data.group
            );
          } else {
            return empty();
          }
        })
      )
      .subscribe((result) => {
        this.refresh();
      });
  }

  deleteDialog(element) {
    element.title = "Supression de l'utilisateur : " + element.email;
    element.content =
      `
            Vous devez saisir la phrase :<br> <p style="color:red;">"JE CONFIRME"</p> afin de valider 
            la suppression de l\'utilisateur :  <br><strong> ` +
      element.email +
      `</strong>"
    `;
    element.validation = "delete";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "500px",
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "JE CONFIRME") {
        this.cognito.deleteUser(element.username).subscribe((data) => {
          this.refresh();
          this.snackBar.open(
            element.email + "a été supprimé avec succès",
            "fermé",
            {
              verticalPosition: "top",
              horizontalPosition: "right",
            }
          );
        });
      } else {
        this.snackBar.open(element.email + " n'a pas été supprimé", "fermé", {
          verticalPosition: "top",
          horizontalPosition: "right",
        });
      }
    });
  }
}
