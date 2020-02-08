import { Injectable } from "@angular/core";
import { AuthService } from "../aws/auth.service";
import remove from "lodash/remove";
import { ReplaySubject, of } from "rxjs";
import { CreateService } from "./create.service";
import { S3Service } from "./../../private/aws/s3.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CartService {
  cart;
  public total_ht = 0;
  public total_ttc = 0;
  public hCart: ReplaySubject<object> = new ReplaySubject<Array<string>>(1);

  domain;
  link;

  specification;

  constructor(
    private S3Service: S3Service,
    private __c_: CreateService,
    private authService: AuthService
  ) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");

    this.cart = JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];

    this.compile();
  }

  specLOad() {
    return this.S3Service.getSpec(
      this.domain + "/" + this.link + "/lists/panier.list.json"
    ).pipe(
      map((data: any) => {
        let spec = JSON.parse(data.Body.toString());

        this.specification = spec;
        return spec;
      })
    );
  }

  add(item, result) {
    let added = false;

    if (this.cart.length > 0) {
      this.cart.map(tmp => {
        if (tmp.ref === item.ref) {
          let confirm_add = confirm(
            `Vous avez déja commander ${tmp.number} Unités du produit \n ${tmp.name} \n\n vous confirmer voulloir ajouter ${result}`
          );

          added = true;
          if (confirm_add) {
            this.total_ht = this.total_ht - tmp.price * parseInt(tmp.number);
            this.total_ttc =
              this.total_ttc -
              tmp.price * parseInt(tmp.number) +
              (tmp.price * parseInt(tmp.number) * tmp.tva) / 100;

            tmp.number = parseInt(tmp.number) + parseInt(result);

            this.total_ht = this.total_ht + tmp.price * parseInt(tmp.number);
            this.total_ttc =
              this.total_ttc +
              tmp.price * parseInt(tmp.number) +
              (tmp.price * parseInt(tmp.number) * tmp.tva) / 100;
          }
        }
      });
    }

    if (!added) {
      this.cart.push({
        name: item.nom_produit,
        number: parseInt(result),
        price: item.prix_vente,
        ref: item.ref,
        tva: item.tva
      });

      this.total_ht = this.total_ht + item.prix_vente * parseInt(result);
      this.total_ttc =
        this.total_ttc +
        item.prix_vente * parseInt(result) +
        (item.prix_vente * parseInt(result) * item.tva) / 100;
    }

    localStorage.setItem("cart", JSON.stringify(this.cart));

    this.hCart.next(this.cart);
  }

  edit(item, result) {
    if (this.cart.length > 0) {
      this.cart.map(tmp => {
        if (tmp.ref === item.ref) {
          this.total_ht = this.total_ht - tmp.price * parseInt(tmp.number);
          this.total_ttc =
            this.total_ttc -
            tmp.price * parseInt(tmp.number) +
            (tmp.price * parseInt(tmp.number) * tmp.tva) / 100;
          tmp.number = parseInt(result);
          this.total_ht = this.total_ht + tmp.price * parseInt(tmp.number);
          this.total_ttc =
            this.total_ttc +
            tmp.price * parseInt(tmp.number) +
            (tmp.price * parseInt(tmp.number) * tmp.tva) / 100;
        }
      });
    }

    localStorage.setItem("cart", JSON.stringify(this.cart));

    this.hCart.next(this.cart);
  }

  delete(item) {
    this.cart = remove(this.cart, function(n: any) {
      return n.ref !== item.ref;
    });

    this.total_ht = this.total_ht - item.price * item.number;
    this.total_ttc =
      this.total_ttc -
      item.price * item.number +
      (item.price * item.number * item.tva) / 100;

    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.hCart.next(this.cart);
  }

  compile() {
    this.cart.map(tmp => {
      this.total_ht = this.total_ht + tmp.price * parseInt(tmp.number);
      this.total_ttc =
        this.total_ttc +
        tmp.price * tmp.number +
        (tmp.price * tmp.number * tmp.tva) / 100;
    });
  }

  commande() {
    let cart = JSON.parse(JSON.stringify(this.cart));
    cart.map(product => {
      let ref = product.ref;
      let keys = ref.toString().split("-");

      product["id_produit"] = keys[0];
      product["id_lot"] = keys[1];
      product["code_depot"] = keys[2];
      product["deplot"] = keys[3];

      delete product.ref;
      delete product.price;
    });

    let commande = {};

    commande["cart"] = cart;
    commande["index"] = new Date().getTime() + "";
    commande["clientname"] = this.authService.userAttributes["name"];
    commande["phone_number"] = this.authService.userAttributes["phone_number"];
    commande["total"] = this.total_ht;
    commande["dcf-status"] = "CONFIRMED";

    Object.keys(this.specification.attr).map(key => {
      commande[key] = this.specification.key[key];
    });

    return this.__c_.create$(
      this.specification.TableName,
      commande,
      this.specification.Region
    );
  }
}
