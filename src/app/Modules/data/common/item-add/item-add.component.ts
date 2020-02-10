import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { OneService } from "src/app/private/crud/one.service";
import isEqual from "lodash/isEqual";
import { MatDialog } from "@angular/material/dialog";
import { AdditemComponent } from "./additem/additem.component";
import { S3Service } from "./../../../../private/aws/s3.service";
import findIndex from "lodash/findIndex";

@Component({
  selector: "app-item-add",
  templateUrl: "./item-add.component.html",
  styleUrls: ["./item-add.component.css"]
})
export class ItemAddComponent implements OnInit {
  val;
  objectConfig;
  tableconfig;
  displayedColumns;
  dataSource;
  source$ = [];
  source = [];
  title;

  quantity;
  ref;
  total = 0;
  totalDisplay = "0";

  group;
  link;
  domain;

  @Output() push: EventEmitter<object> = new EventEmitter<object>();

  @Input() set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);

      this.tableconfig = this.S3Service.getSpec(
        this.domain + "/" + this.link + "/lists" + "/" + this.objectConfig.table
      ).pipe(
        map((data: any) => {
          let spec = JSON.parse(data.Body.toString());

          this.title = spec.title;
          return spec;
        })
      );
    }
  }

  @Input() set value(val) {
    if (val) {
      this.source = JSON.parse(val);
      this.compileTable();
    }
  }

  tmp_product;
  constructor(
    private S3Service: S3Service,
    private __o_: OneService,
    public dialog: MatDialog
  ) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {}

  createItem(): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
      width: this.objectConfig["item-width"],
      height: this.objectConfig["item-height"],
      data: {
        config: {
          item: this.objectConfig.form
        },
        value: {}
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.source.push(result.item);
        this.compileTable();
        this.emit();
      }
    });
  }

  private compileTable() {
    this.dataSource = of(this.source);
  }

  private emit() {
    let obj = {};
    obj[this.objectConfig.name] = this.source;
    this.push.emit(obj);
  }

  delete(element) {
    const index = findIndex(this.source, function(item) {
      return isEqual(item, element);
    });
    (<Array<any>>this.source).splice(index, 1);
    this.compileTable();
    this.emit();
  }
}
