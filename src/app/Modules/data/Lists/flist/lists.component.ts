import { flatMap } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogComponent } from "../../common/dialog/dialog.component";
import { S3Service } from "./../../../../private/aws/s3.service";
import { CrudService } from "src/app/private/firebase/crud.service";
import { map } from "rxjs/operators";
import orderBy from "lodash/orderBy";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"],
})
export class ListsComponent implements OnInit {
  Domain;
  link;
  pageload;
  File;
  params;
  Specification;
  name;
  data;
  count;
  pageIndex;
  id;
  imagePath;
  startAfter;
  enfBefore;
  limit;

  urlItem;

  constructor(
    private router: ActivatedRoute,
    public dialog: MatDialog,
    private S3Service: S3Service,
    public snackBar: MatSnackBar,
    private route: Router,
    private __g_: CrudService
  ) {
    this.Domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {
    const pageload = this.router.queryParams.pipe(
      flatMap((params: any) => {
        this.urlItem = params.item;
        return this.S3Service.getSpec(
          this.Domain + "/" + this.link + "/lists/" + params.item + ".list.json"
        );
      }),
      flatMap((File: any) => {
        this.Specification = JSON.parse(File.Body.toString());
        this.name = (<any>this.Specification).name;
        this.limit = (<any>this.Specification).query.limit;
        this.imagePath = (<any>this.Specification).directpath;
        this.startAfter = null;
        this.enfBefore = null;
        this.count = 0;
        this.pageIndex = 0;
        return this.__g_.count(this.Specification.query);
      }),
      flatMap((data: any) => {
        data.forEach((item) => {
          this.count++;
        });
        return this.__g_.get(this.Specification.query);
      }),
      map((data) => {
        console.log(data);
        return data;
      })
    );

    this.pageload = this.continurQuery(pageload);
  }

  refresh() {
    const pageload = this.__g_.count(this.Specification.query).pipe(
      flatMap((data: any) => {
        data.forEach((item) => {
          this.count++;
        });
        return this.__g_.get(this.Specification.query);
      })
    );

    this.pageload = this.continurQuery(pageload);
  }

  handlePage(event) {
    let pageload;
    if (event.previousPageIndex > event.pageIndex) {
      this.pageIndex--;
      pageload = this.__g_.get({
        ...this.Specification.query,
        previous: true,
        startAfter: this.startAfter,
      });
    } else if (event.previousPageIndex < event.pageIndex) {
      this.pageIndex++;
      pageload = this.__g_.get({
        ...this.Specification.query,
        startAfter: this.enfBefore,
      });
    } else {
      this.limit = event.pageSize;
      pageload = this.__g_.get({
        ...this.Specification.query,
        limit: event.pageSize,
      });
    }

    this.pageload = this.continurQuery(pageload);
  }

  private continurQuery(pageload) {
    return pageload.pipe(
      flatMap((data: any) => {
        return data;
      }),
      map((data$: any) => {
        let data = [];
        data$.forEach((doc) => {
          data.push({
            ...doc.data(),
            id: doc.id,
            path: doc.ref.path,
          });
        });

        this.startAfter = data$.docs[data$.docs.length - 1];
        this.enfBefore = data$.docs[0];

        if (this.Specification.orderBy) {
          data = orderBy(
            data,
            [this.Specification.orderBy[0]],
            [this.Specification.orderBy[1]]
          );
        }
        console.log(data);
        return data;
      })
    );
  }

  goto(item) {
    this.route.navigate([this.Specification.Link], {
      queryParams: {
        item: this.urlItem,
        id: item.id,
        path: item.path,
      },
    });
  }

  deleteDialog(element) {
    let label = element.label
      ? element.label
      : element.title
      ? element.title
      : element.name;

    if (this.File === "trash") {
      element.title = "Supression de : " + label;
    } else {
      element.title = "Mise en corbeille de : " + label;
    }

    // tslint:disable-next-line:max-line-length

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

    element.validation = "delete";

    console.log(element);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "500px",
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "JE CONFIRME") {
        this.__g_.delete(element.path).subscribe((data) => {
          this.snackBar.open(
            (element.name || element.title) + " suprimé avec succés",
            "fermé",
            {
              verticalPosition: "top",
              horizontalPosition: "right",
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
            horizontalPosition: "right",
          }
        );
      }
    });
  }
}
