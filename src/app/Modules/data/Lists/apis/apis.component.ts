import { HttpClient } from "@angular/common/http";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { S3Service } from "./../../../../private/aws/s3.service";
import { map, flatMap } from "rxjs/operators";
import { MatDialog, MatSnackBar, MatSort } from "@angular/material";
import { ListVars } from "src/app/private/interfaces/list.vars";

@Component({
  selector: "app-apis",
  templateUrl: "./apis.component.html",
  styleUrls: ["./apis.component.css"]
})
export class ApisComponent implements OnInit, OnDestroy {
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
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private S3Service: S3Service,
    private HttpClient: HttpClient
  ) {
    this.vars.Domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  panelOpenState = false;
  dorefresh = true;
  link;

  ngOnInit() {
    this.pageload = this.router.queryParams.pipe(
      map(params => {
        this.FilterOpenState = true;
        this.vars.ExpressionAttributeValues = {};
        this.vars.File = params.item;
      }),
      flatMap(data => {
        return this.S3Service.getSpec(
          this.vars.Domain +
            "/" +
            this.link +
            "/social/" +
            this.vars.File +
            ".list.json"
        ).pipe(
          map((spec: any) => {
            return JSON.parse(spec.Body.toString());
          })
        );
      }),
      flatMap((data: any) => {
        this.vars.Specification = data;
        this.name = data.name;

        this.vars.addLabel = data.addLabel;

        return this.HttpClient.get(data.url).pipe(
          map((data: any) => {
            return data.posts.data;
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.pageload = null;
  }
}
