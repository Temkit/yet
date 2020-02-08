import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject
} from "@angular/core";
import { forkJoin, of } from "rxjs";
import { map } from "rxjs/operators";
import { S3Service } from "./../../../../private/aws/s3.service";
import { OneService } from "src/app/private/crud/one.service";
import remove from "lodash/remove";
import findIndex from "lodash/findIndex";
import isEqual from "lodash/isEqual";
import { MatDialog } from "@angular/material";
import { AdditemComponent } from "./additem/additem.component";

@Component({
  selector: "app-order-add",
  templateUrl: "./order-add.component.html",
  styleUrls: ["./order-add.component.css"]
})
export class OrderAddComponent implements OnInit {
  dummy;
  val;
  objectConfig;
  tableconfig;
  dataSource;
  summarise;
  source$ = [];
  source = [];

  domain;
  link;

  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private S3Service: S3Service,
    private __o_: OneService,
    public dialog: MatDialog
  ) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
    this.dummy = new Date().getTime();
  }

  ngOnInit() {}

  @Input()
  set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
      this.S3Service.getSpec(
        this.domain + "/" + this.link + "/lists" + "/" + this.objectConfig.table
      ).pipe(
        map((data: any) => {
          return JSON.parse(data.Body.toString());
        })
      );
    }
  }

  @Input()
  set value(val) {
    const valueToDisplay = JSON.parse(val);
    if (valueToDisplay && valueToDisplay.length > 0) {
      this.source = valueToDisplay;
      this.compileTable();
    }
  }

  deleteProduct(element) {
    const index = findIndex(this.source, function(item) {
      return isEqual(item, element);
    });
    (<Array<any>>this.source).splice(index, 1);
    this.compileTable();
    this.emit();
  }

  editProduct(element) {
    for (let k in this.objectConfig.key) {
      this.objectConfig.key[k] = element[k];
    }

    let value = {};

    value["product"] = this.objectConfig.key;
    value["quantity"] = element.quantity;
    value["taxes"] = element.taxes;

    const dialogRef = this.dialog.open(AdditemComponent, {
      width: this.objectConfig["item-width"],
      height: this.objectConfig["item-height"],
      data: {
        config: {
          item: this.objectConfig.form
        },
        value: value
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  private compileTable() {
    this.source$ = [];

    this.source.map(product => {
      this.source$.push(
        this.__o_
          .one$(
            this.objectConfig.TableName,
            product.product,
            this.objectConfig.Region
          )
          .pipe(
            map((data: any) => {
              data.quantity = product.quantity;
              data.taxes = product.taxes;
              return data;
            })
          )
      );
    });

    if (this.source$.length > 0) {
      this.dataSource = forkJoin(this.source$).pipe(
        map(data => {
          return data;
        })
      );
    } else {
      this.dataSource = of([]);
    }

    // this.summarise = this.__taxes_.summary(this.objectConfig, this.dataSource);
  }

  emit() {
    const vte = {};
    vte[this.objectConfig.valueToEmit] = this.source;
    this.patch.emit(vte);
  }

  openDialog(): void {
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
        let scope = this;
        scope.source = remove(scope.source, function(n) {
          if (n.product === result.product) {
            result.quantity = result.quantity + n.quantity;
            return false;
          }
          return true;
        });

        this.source.push({
          product: result.product,
          quantity: result.quantity,
          taxes: result.taxes
        });
        this.compileTable();
        this.emit();
      }
    });
  }
}
