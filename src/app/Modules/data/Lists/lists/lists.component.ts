import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, flatMap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Sort, MatSort } from "@angular/material/sort";
import { DialogComponent } from "../../common/dialog/dialog.component";
import { ListVars } from "src/app/private/interfaces/list.vars";
import { QueryService } from "src/app/private/crud/query.service";
import { DeleteService } from "src/app/private/crud/delete.service";
import { CrudToolsService } from "src/app/private/crud/crud-tools.service";
import { OneService } from "src/app/private/crud/one.service";
import { AuthService } from "src/app/private/aws/auth.service";
import { empty, of } from "rxjs";
import { CartService } from "src/app/private/crud/cart.service";
import { AddCartComponent } from "../../modal/addCart/addCart.component";
import { ShowDataComponent } from "../../modal/showData/showData.component";
import { S3Service } from "./../../../../private/aws/s3.service";
import { Store, select, State } from "@ngrx/store";
import {
  addPosition,
  setPositions,
  setPageSize
} from "../../../../redux/actions/list.actions";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"]
})
export class ListsComponent implements OnInit, OnDestroy {
  vars = {
    Filters: {},
    FormElements: [],
    Specification: {
      ScanIndexForward: true
    },
    Index: 0,
    delete: {},
    Count: 0,
    ExclusiveStartKey: null
  } as ListVars;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  name;

  init;
  initialFilterForm = null;
  filterForm = null;
  pageload = null;
  load = null;
  sortedData;
  FilterOpenState = true;

  isSorting = false;

  constructor(
    private router: ActivatedRoute,
    private S3Service: S3Service,
    private route: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private __q_: QueryService,
    private __o_: OneService,
    private __d_: DeleteService,
    private ct: CrudToolsService,
    private cartService: CartService,
    private store: Store<{ position: object }>,
    private state: State<{ postions: Array<object> }>
  ) {
    store.pipe(select("position")).subscribe((data: any) => {
      this.vars.Limit = data.pageSize;
      this.load = this.setlistData(false);
    });

    this.vars.Domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  panelOpenState = false;
  dorefresh = true;
  link;

  togglePanel() {
    this.FilterOpenState = !this.FilterOpenState;
  }

  openBottomSheet(): void {
    // this.bottomSheet.open(ImportExportComponent);
  }

  handlePage(event) {
    if (event.pageSize !== this.state.getValue()["position"]["pageSize"]) {
      this.store.dispatch(setPageSize({ pageSize: event.pageSize }));
    } else if (event.previousPageIndex > event.pageIndex) {
      this.previous();
    } else if (event.previousPageIndex < event.pageIndex) {
      this.next();
    }
  }

  private next() {
    this.store.dispatch(addPosition({ position: this.vars.ExclusiveStartKey }));
  }

  private previous() {
    let positions = this.state.getValue()["position"]["positions"];
    positions.splice(-1, 1);
    if (positions.length === 0 || positions === undefined) {
      positions = [null];
    }

    this.store.dispatch(setPositions({ positions: positions }));
  }

  ngOnInit() {
    this.pageload = this.router.queryParams.pipe(
      map(params => {
        this.FilterOpenState = true;
        this.vars.ExpressionAttributeValues = {};
        this.vars.File = params.item;
      }),
      flatMap(() => {
        return this.S3Service.getSpec(
          this.vars.Domain +
            "/" +
            this.link +
            "/lists/" +
            this.vars.File +
            ".list.json"
        );
      }),
      map((spec: any) => {
        this.vars.Specification = JSON.parse(spec.Body.toString());

        this.name = (<any>this.vars.Specification).name;

        this.vars.addLabel = (<any>this.vars.Specification).addLabel;
        this.vars.addType = (<any>this.vars.Specification).addType;

        if (
          this.vars.Specification.filtres &&
          Object.keys((<any>this.vars.Specification).filtres).length > 0
        ) {
          this.initialFilterForm = (<any>this.vars.Specification).filters;
          this.filterForm = (<any>this.vars.Specification).filtres;
        } else {
          this.filterForm = null;
        }

        this.filter(false, (<any>this.vars.Specification).init);

        return empty();
      })
    );
  }

  ngOnDestroy() {
    this.load = null;
  }

  filter(cache, event) {
    this.vars.TableName = event.query.TableName;
    this.vars.IndexName = event.query.IndexName;
    this.vars.ProjectionExpression = event.query.ProjectionExpression;
    this.vars.FilterExpression = event.query.FilterExpression;
    this.vars.Region = event.query.Region;
    this.vars.KeyConditionExpression = event.query.KeyConditionExpression;
    this.vars.ExpressionAttributeNames_Additional =
      event.query.ExpressionAttributeNames_Additional;
    this.vars.Limit = event.query.Limit;

    const ExpressionAttributeNames_Additional =
      event.query.ExpressionAttributeNames_Additional || {};

    for (let key in event.query.ExpressionAttributeNames_Additional) {
      if (
        (this.vars.ExpressionAttributeNames_Additional &&
          !this.vars.ExpressionAttributeNames_Additional.hasOwnProperty(key)) ||
        !this.vars.ExpressionAttributeNames_Additional
      ) {
        ExpressionAttributeNames_Additional[key] =
          event.query.ExpressionAttributeNames[key];
      }
    }

    const ExpressionAttributeNames = event.query.ExpressionAttributeNames || {};

    for (let key in event.query.ExpressionAttributeNames) {
      if (
        (this.vars.ExpressionAttributeNames &&
          !this.vars.ExpressionAttributeNames.hasOwnProperty(key)) ||
        !this.vars.ExpressionAttributeNames
      ) {
        ExpressionAttributeNames[key] =
          event.query.ExpressionAttributeNames[key];
      }
    }

    const ExpressionAttributeValues =
      event.query.ExpressionAttributeValues || {};

    let refresh = false;

    Object.keys(event.value).map(key => {
      if (event.value[key] !== undefined && event.value[key].length === 0) {
        refresh = true;
      } else if (event.value[key]) {
        ExpressionAttributeValues[":" + key] = event.value[key];
      }
    });

    if (refresh) {
      this.refresh();
    } else {
      this.vars.ExpressionAttributeNames_Additional = ExpressionAttributeNames_Additional;
      this.vars.ExpressionAttributeNames = ExpressionAttributeNames;
      this.vars.ExpressionAttributeValues = ExpressionAttributeValues;

      Object.keys(this.vars.ExpressionAttributeValues).map(key => {
        if (
          this.vars.Specification.queryType &&
          this.vars.Specification.queryType.type === "fromCache" &&
          key === this.vars.Specification.queryType.dataKey &&
          this.vars.ExpressionAttributeValues[key] === "undefined"
        ) {
          this.vars.ExpressionAttributeValues[key] = localStorage.getItem(
            this.vars.Specification.queryType.cacheKey
          );
        } else {
          if (this.vars.ExpressionAttributeValues[key] === "undefined") {
            this.vars.ExpressionAttributeValues[key] =
              event.value[key.substring(1)];
          }
        }
      });

      this.load = this.setlistData(cache);
    }
  }

  setlistData(cached) {
    let lek = this.state.getValue()["position"]["positions"]
      ? this.state.getValue()["position"]["positions"].slice(-1)[0]
      : null;

    let limit =
      this.vars.Limit !== undefined
        ? this.vars.Limit
        : this.state.getValue()["position"]["pageSize"];

    return this.__q_
      .query$(
        "query",
        this.vars.TableName,
        this.vars.IndexName,
        this.vars.KeyConditionExpression,
        this.vars.ProjectionExpression,
        this.vars.FilterExpression,
        this.vars.ExpressionAttributeNames,
        this.vars.ExpressionAttributeNames_Additional,
        this.vars.ExpressionAttributeValues,
        limit,
        lek,
        true,
        this.vars.Region,
        (<any>this.vars.Specification).sort,
        cached
      )
      .pipe(
        map((items: any) => {
          this.vars.ExclusiveStartKey = items.LastEvaluatedKey;

          setTimeout(() => (this.vars.Count = items.Count), 0);

          const data = [];
          items.Items.map(i => {
            i["imagecache"] = this.ct.id(12);
            data.push(i);
          });

          return data;
        })
      );
  }

  handleEvent(key) {
    this.vars.Items = this.__o_
      .one$(this.vars.TableName, key, this.vars.Region)
      .pipe(
        map(data => {
          data["imagecache"] = new Date().getTime();
          return [data];
        })
      );
  }

  goto(item, link?, QueryParams?) {
    if (
      this.vars.Specification.Link === "modal" &&
      this.vars.Specification.modal.type === "commande" &&
      item !== null &&
      !link
    ) {
      this.commande(item);
    } else if (
      this.vars.Specification.Link === "modal" &&
      this.vars.Specification.modal.type === "data" &&
      item !== null &&
      !link
    ) {
      this.dataShow(item);
    } else if (!item && link) {
      this.route.navigate([link], {
        queryParams: this.vars.Specification.QueryParams
          ? JSON.parse(JSON.stringify(this.vars.Specification.QueryParams))
          : null
      });
    } else {
      let queryParams;

      if (this.vars.Specification.QueryParams) {
        queryParams = JSON.parse(
          JSON.stringify(this.vars.Specification.QueryParams)
        );

        Object.keys(queryParams).map(key => {
          if (queryParams[key] === "undefined") {
            queryParams[key] = item[key];
          }
        });

        this.route.navigate([this.vars.Specification.Link], {
          queryParams
        });
      }
    }
  }

  refresh() {
    this.initialFilterForm = this.filterForm;
    this.filter(false, this.vars.Specification.init);
  }

  deleteDialog(element) {
    Object.keys(this.vars.Specification.Key).map(key => {
      this.vars.Specification.Key[key] = element[key];
    });

    let label = element.label
      ? element.label
      : element.title
      ? element.title
      : element.name;

    if (this.vars.File === "trash") {
      element.title = "Supression de : " + label;
    } else {
      element.title = "Mise en corbeille de : " + label;
    }

    // tslint:disable-next-line:max-line-length

    if (this.vars.Specification.img) {
      element.content =
        `
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-4 p-0">
          <img height="140" width="140"src="https://` +
        this.vars.Specification.img.bucket +
        `/` +
        this.vars.Specification.img.imagePath +
        element.image +
        `/` +
        this.vars.Specification.img.imageName +
        `?dummy=` +
        element.imagecache +
        `" alt="">
        </div>
        <div class="col-lg-8">
            Vous devez saisir la phrase :<br> <p style="color:red;">"JE CONFIRME"</p> afin de valider 
            la suppression de l\'element :  <br><strong> ` +
        element.title +
        `</strong>"
        </div>
      </div>
    </div>
    `;
    } else {
      element.content =
        `
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
            Vous devez saisir la phrase :<br> <p style="color:red;">"JE CONFIRME"</p> afin de valider 
            la suppression de l\'element :  <br><strong> ` +
        element.title +
        `</strong>"
        </div>
      </div>
    </div>
    `;
    }

    element.validation = "delete";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "500px",
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "JE CONFIRME") {
        const key = JSON.parse(JSON.stringify(this.vars.Specification.Key));
        Object.keys(key).map(k => {
          if (key[k] === "undefined") {
            key[k] = element[k];
          }
        });

        this.__d_
          .delete$(this.vars.TableName, key, this.vars.Region)
          .subscribe(data => {
            this.snackBar.open(
              (element.name || element.title) + " suprimé avec succés",
              "fermé",
              {
                verticalPosition: "top",
                horizontalPosition: "right"
              }
            );
            this.refresh();
          });
      } else {
        this.snackBar.open(
          (element.name || element.title) + " n'a pas été supprimé",
          "fermé",
          {
            verticalPosition: "top",
            horizontalPosition: "right"
          }
        );
      }
    });
  }

  commande(item) {
    let element = this.vars.Specification.modal;
    element.data = item;
    const adddialogRef = this.dialog.open(AddCartComponent, {
      width: "80vw",
      data: element
    });

    adddialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.add(item, result);
      }
    });
  }

  dataShow(item) {
    let element = this.vars.Specification.modal;
    element.data = item;
    const showDataDialogRef = this.dialog.open(ShowDataComponent, {
      width: "50%",
      data: element
    });

    showDataDialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  sortData(sort: Sort, items: any) {
    this.isSorting = true;
    const data = items.slice();

    if (!sort.active || sort.direction === "") {
      this.load = of(data);
      return;
    }

    let sorted = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      let x = compare(a[sort.active], b[sort.active], isAsc);
      return x;
    });
    // console.log(data, sorted);

    this.load = of(sorted).pipe(
      map(data => {
        this.isSorting = false;
        return data;
      })
    );
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
