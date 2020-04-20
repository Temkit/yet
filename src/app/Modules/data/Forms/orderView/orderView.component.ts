import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, flatMap } from "rxjs/operators";
import { OneService } from "src/app/private/crud/one.service";
import { QueryService } from "src/app/private/crud/query.service";
import { AuthService } from "src/app/private/aws/auth.service";
import { S3Service } from "src/app/private/aws/s3.service";

@Component({
  selector: "app-orderView",
  templateUrl: "./orderView.component.html",
  styleUrls: ["./orderView.component.css"],
})
export class OrderViewComponent implements OnInit {
  domain;
  link;

  load;
  eav;
  commande;
  key;
  params;
  reffacture;
  owner;
  Specification;

  customer;

  products = [];

  total = 0;
  totalht = 0;
  totaltva = 0;

  displayedColumns = ["produit", "prix_vente", "quantite", "total"];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private S3Service: S3Service,
    private __o_: OneService,
    private __q_: QueryService
  ) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {
    this.load = this.route.queryParams.pipe(
      map((params) => {
        this.params = { ...params };
      }),
      flatMap(() => {
        return this.S3Service.getSpec(
          this.domain + "/" + this.link + "/layout/order.json"
        ).pipe(
          map((spec: any) => {
            return JSON.parse(spec.Body.toString());
          })
        );
      }),
      flatMap((data: any) => {
        this.Specification = data;

        this.eav = {
          ...this.Specification.items.ExpressionAttributeValues,
        };

        this.eav[this.Specification.eavParams] = this.params[
          this.Specification.urlParams
        ];

        return this.authService.getCurrentUser();
      }),
      flatMap((data) => {
        this.owner = data.attributes;
        let key = { ...this.Specification.key };

        Object.keys(key).forEach((k) => {
          if (key[k] === "undefined") {
            key[k] = this.params[this.Specification.urlParams];
          }
        });
        return this.__o_.one$(
          this.Specification.items.TableName,
          key,
          this.Specification.items.Region
        );
      }),
      flatMap((data) => {
        console.log(data);
        this.commande = data;
        return this.__q_.query$(
          "query",
          this.Specification.items.TableName,
          this.Specification.items.IndexName,
          this.Specification.items.KeyConditionExpression,
          this.Specification.items.ProjectionExpression,
          this.Specification.items.FilterExpression,
          this.Specification.items.ExpressionAttributeNames,
          this.Specification.items.ExpressionAttributeNames_Additional,
          this.eav,
          this.Specification.items.Limit,
          null,
          true,
          this.Specification.items.Region,
          null,
          false
        );
      }),
      map((data) => {
        console.log(data);
        data.Items.forEach((item) => {
          this.totaltva =
            this.totaltva +
            (item.prix_vente * item.tva * item.quantite +
              item.prix_vente * item.quantite);
          this.totalht = this.totalht + item.prix_vente * item.quantite;
        });
        this.products = data.Items;

        return data.Items;
      })
    );
  }

  /*   DaData(attribute) {
    if (typeof attribute === "string" && attribute.includes("undefined")) {
      attribute = attribute.replace("undefined|", "");

      switch (attribute) {
        case "custom:id":
          return this.tiers || this.authService.userAttributes[attribute];

        case "ref":
          return this.ref;
        case "reffacture":
          return this.reffacture;

        case "today":
          return new Date().getTime();
        case "tomorow":
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.getTime();

        default:
          return attribute;
      }
    }

    return attribute;
  } */
}
