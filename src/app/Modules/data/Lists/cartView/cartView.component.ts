import { AuthService } from "./../../../../private/aws/auth.service";
import { SEService } from "./../../../../private/aws/ses.service";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { CartService } from "src/app/private/crud/cart.service";
import { map, flatMap } from "rxjs/operators";
import { MatDialog } from "@angular/material";
import { DialogComponent } from "../../common/dialog/dialog.component";

@Component({
  selector: "app-cartView",
  templateUrl: "./cartView.component.html",
  styleUrls: ["./cartView.component.css"]
})
export class CartViewComponent implements OnInit {
  pageLOad;
  load;
  specification;
  date;

  constructor(
    private _location: Location,
    private cartService: CartService,
    private SEService: SEService,
    private AuthService: AuthService,
    public dialog: MatDialog
  ) {
    this.load = this.cartService.cart;

    this.cartService.hCart.asObservable().subscribe((data: any) => {
      this.load = data;
    });

    this.pageLOad = this.cartService.specLOad().pipe(
      map(data => {
        this.specification = data;
        return data;
      })
    );

    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };

    this.date = new Date().toLocaleDateString("fr-FR", options);
  }

  ngOnInit() {}

  back() {
    this._location.back();
  }

  commande() {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart.length > 0) {
      this.cartService
        .commande()
        .pipe(
          flatMap(data => {
            return this.AuthService.getCurrentUser();
          }),
          flatMap(data => {
            let cartContent = this.tableToHtml(cart);

            let emailTemplate = `<div>
          <h3>Nouvelle commande</h3>

          <div><strong>Client :</strong> ${data.attributes.name}</div>
          <div><strong>Adresse :</strong> ${data.attributes.address}</div>
          <div><strong>Registre de commece N° :</strong> ${data.attributes["custom:registre"]}</div>
          <div><strong>Matriculte Fiscale :</strong> ${data.attributes["custom:matricule_fiscal"]}</div>
          <div><strong>Article Fiscale :</strong> ${data.attributes["custom:article"]}</div>
          <div><strong>Numéro de téléphone :</strong> ${data.attributes.phone_number}</div>
          
          <h4>Contenu commande</h4>

          ${cartContent}
          
          </div>`;

            return this.SEService.sendEmail(
              this.specification.email.bcc,
              this.specification.email.cc,
              emailTemplate,
              this.specification.email.subject,
              this.specification.email.source,
              this.specification.email.to
            );
          })
        )
        .subscribe(
          data => {
            localStorage.setItem("cart", JSON.stringify([]));
            this.cartService.hCart.next([]);

            this.cartService.total_ttc = 0;
            this.cartService.total_ht = 0;

            let element = {} as any;

            element.title = "Commande validé !";

            // tslint:disable-next-line:max-line-length
            element.content = `<div class="pt-3 pb-3">Votre commande à été Confirmé, un de nos collaborateurs va vous contacter dans les plus brefs délais afin de valider votre commande</div>
    `;
            const dialogRef = this.dialog.open(DialogComponent, {
              width: "500px",
              data: element
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log(result);
            });
          },
          err => {
            console.log(err);
          }
        );
    } else {
      let element = {} as any;

      element.title = "Panier Vide !";

      // tslint:disable-next-line:max-line-length
      element.content = `<div class="pt-3 pb-3">Votre Panier est vide veuillez séléctionner des produits à commander. merci.</div>
    `;
      const dialogRef = this.dialog.open(DialogComponent, {
        width: "500px",
        data: element
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }
  }

  tableToHtml(jsonobj) {
    let tblstr = `<table style="border-collapse: collapse; width: 100 %;"">`;
    tblstr += `<tr style=" padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;">`;
    for (let prop in jsonobj[0]) {
      tblstr += `<th style="border: 1px solid #ddd;padding: 8px;">${prop}`;
    }
    tblstr += jsonobj.reduce((s, x) => {
      s += "<tr>";
      for (let prop in x) {
        s += `<td style="border: 1px solid #ddd;padding: 8px;">${x[prop]}`;
      }
      return s;
    }, "");
    tblstr += "</table>";
    return tblstr;
  }
}
