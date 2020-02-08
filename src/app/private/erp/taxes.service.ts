import { Injectable } from "@angular/core";
import { forkJoin, of } from "rxjs";
import { OneService } from "../crud/one.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TaxesService {
  constructor(private __o_: OneService) {}

  summary(config, datasource) {
    return datasource.pipe(
      map((products: Array<any>) => {
        const sum = {};
        let total = 0;
        let taxes = 0;
        const taxeDisplay = {};
        const taxeProcess = {};
        let ttc = 0;

        products.map((product: any) => {
          const taxesCOmpile = [];
          total = total + product.price * product.quantity;

          product.taxes.map(taxe => {
            taxesCOmpile.push(this.getTaxe(config, taxe));
          });

          forkJoin(taxesCOmpile).subscribe(data => {
            data.map((tax: any) => {
              let oneTaxe =
                product.price * product.quantity * (tax.valeur / 100);
              taxeProcess[tax.name] =
                (taxeProcess[tax.name] ? taxeProcess[tax.name] : 0) + oneTaxe;
            });
          });
        });

        Object.keys(taxeProcess).map(tax => {
          taxes = taxes + taxeProcess[tax];
          taxeDisplay[tax] = taxeProcess[tax].toLocaleString("fr-FR", {
            style: "currency",
            currency: config.currency
          });
        });

        ttc = total + taxes;

        sum["ht"] = total.toLocaleString("fr-FR", {
          style: "currency",
          currency: config.currency
        });
        sum["taxe"] = taxes.toLocaleString("fr-FR", {
          style: "currency",
          currency: config.currency
        });
        sum["taxeDisplay"] = taxeDisplay;
        sum["ttc"] = ttc.toLocaleString("fr-FR", {
          style: "currency",
          currency: config.currency
        });

        return sum;
      })
    );
  }

  getTaxe(config, taxe) {
    const key = JSON.parse(JSON.stringify(config.taxSelect.key));

    Object.keys(config.taxSelect.key).map(k => {
      if (key[k] === "undefined") {
        key[k] = taxe;
      }
    });

    return this.__o_.one$(
      config.taxSelect.options.TableName,
      key,
      config.taxSelect.options.Region
    );
  }
}
