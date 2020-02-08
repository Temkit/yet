import { S3Service } from "src/app/private/aws/s3.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { of, empty } from "rxjs";
import { TaxesService } from "src/app/private/erp/taxes.service";
import { MatDialog } from "@angular/material";
import { AdditemComponent } from "./additem/additem.component";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-order-add-free",
  templateUrl: "./order-add-free.component.html",
  styleUrls: ["./order-add-free.component.css"]
})
export class OrderAddFreeComponent implements OnInit {
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  products = [];
  products$;
  displayedColumns = ["label", "price", "quantity", "taxes", "description"];
  summarise;
  objectConfig;
  options;
  taxes;
  tableconfig;

  constructor(
    private http: HttpClient,
    private __taxes_: TaxesService,
    public dialog: MatDialog,
    private S3Service: S3Service
  ) {}

  ngOnInit() {}

  @Input()
  set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
      this.tableconfig = this.S3Service.getSpec(this.objectConfig.table).pipe(
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
      valueToDisplay.map(item => {
        this.addItem(item);
      });
    }
  }

  private addItem(item) {
    this.products.push(item);
    this.products$ = of(this.products);
    return (this.summarise = this.__taxes_
      .summary(this.objectConfig, this.products$)
      .pipe(
        map((data: any) => {
          return data;
        })
      ));
  }

  emit() {
    const vte = {};
    vte[this.objectConfig.valueToEmit] = this.products;
    this.patch.emit(vte);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
      width: "800px",
      height: "550px",
      data: {
        config: this.objectConfig
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        map(data => {
          if (data) {
            return this.addItem(data);
          } else {
            return empty();
          }
        })
      )
      .subscribe(result => {
        this.emit();
      });
  }
}
