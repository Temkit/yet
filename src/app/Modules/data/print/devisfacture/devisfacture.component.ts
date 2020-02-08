import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { bindCallback, forkJoin, empty } from "rxjs";
import { map, switchMap, flatMap } from "rxjs/operators";
import { DatePipe, isPlatformBrowser } from "@angular/common";
import { QueryService } from "src/app/private/crud/query.service";
import { OneService } from "src/app/private/crud/one.service";
import { AuthService } from "src/app/private/aws/auth.service";
import { CognitoService } from "src/app/private/aws/cognito.service";

declare let pdfMake: any;

@Component({
  selector: "app-devisfacture",
  templateUrl: "./devisfacture.component.html",
  styleUrls: ["./devisfacture.component.css"]
})
export class DevisfactureComponent implements OnInit {
  pdf;
  objectConfig;
  objectValue;

  count = "";

  domain;
  company;
  customer;
  logo;

  subtotale = 0;
  taxtotale = 0;
  globaletotale = 0;

  products = [];
  products$ = [];

  pdfTable: Array<any> = [
    [
      {
        text: "Produits",
        style: "itemsHeader"
      },
      {
        text: "Qty",
        style: ["itemsHeader", "center"]
      },
      {
        text: "Prix",
        style: ["itemsHeader", "center"]
      },
      {
        text: "Taxe",
        style: ["itemsHeader", "center"]
      },
      {
        text: "Rabais",
        style: ["itemsHeader", "center"]
      },
      {
        text: "Total",
        style: ["itemsHeader", "center"]
      }
    ]
  ];
  isBrowser;

  @ViewChild("frame", { static: false }) frame: ElementRef;

  constructor(
    private __q_: QueryService,
    private __o_: OneService,
    private authService: AuthService,
    private cognitoService: CognitoService,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.domain = localStorage.getItem("domain");
  }

  @Input()
  set config(val) {
    if (val) {
      this.objectConfig = JSON.parse(val);
    }
  }

  @Input()
  set value(val) {
    if (val) {
      this.objectValue = JSON.parse(val);
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.getLogo()
        .pipe(
          map(data => {
            this.logo = data;
            return data;
          }),
          switchMap(data => {
            return this.getCompany();
          }),
          map(data => {
            this.company = data;
          }),
          switchMap(data => {
            return this.getCustomer();
          }),
          map(data => {
            this.customer = data;
          }),
          switchMap(data => {
            return this.getProducts();
          })
        )
        .subscribe(data => {
          data.map((product: any) => {
            this.subtotale = this.subtotale + product.price * product.quantity;

            const productName = {
              text: product.name,
              style: "itemTitle"
            };

            const span = document.createElement("span");
            span.innerHTML = product.description;

            const productDescription = {
              text: span.textContent || span.innerText,
              style: "itemSubTitle"
            };

            let totale = 0;
            let productTaxes = "";

            product.taxes.map(taxe => {
              productTaxes = productTaxes + taxe.valeur + "%";
              totale =
                totale + (product.price * product.quantity * taxe.valeur) / 100;
              this.taxtotale =
                this.taxtotale +
                (product.price * product.quantity * taxe.valeur) / 100;
            });

            totale = totale + product.price * product.quantity;

            const newline = [
              [productName, productDescription],
              {
                text: product.quantity,
                style: "itemNumber"
              },
              {
                text: product.price + " DZD",
                style: "itemNumber"
              },
              {
                text: productTaxes,
                style: "itemNumber"
              },
              {
                text: "0%",
                style: "itemNumber"
              },
              {
                text: totale.toFixed(2) + " DZD",
                style: "itemNumber"
              }
            ];

            this.pdfTable.push(newline);
          });

          this.products = data;
          // this.initfile();
        });
    }
  }

  private getCompany() {
    return this.__o_.one$(
      this.objectConfig.company.TableName,
      this.objectConfig.company.Key,
      this.objectConfig.company.Region,
      this.objectConfig.company.AttributesToGet
    );
  }

  private getLogo() {
    if (this.isBrowser) {
      let toDataUrlObservable = bindCallback(this.toDataUrl);
      return toDataUrlObservable(
        "https://s3.eu-west-3.amazonaws.com/img.yet.expert/yet.marketing/" +
          this.domain +
          "/config/" +
          this.domain +
          ".logo.jpg"
      );
    }
  }

  private getCustomer() {
    if (this.isBrowser) {
      if (this.objectValue[this.objectConfig.customer.data]) {
        //Si le client à été séléctionné
        return this.__o_.one$(
          this.objectConfig.customer.TableName,
          this.objectValue[this.objectConfig.customer.data],
          this.objectConfig.customer.Region
        );
      } else {
        return empty();
      }
    }
  }

  private getProducts() {
    if (this.isBrowser) {
      if (this.objectConfig.produits) {
        const pkey = JSON.parse(
          JSON.stringify(this.objectConfig.property.keys.product.Key)
        );
        this.objectConfig.produits.map(produit => {
          let tmp_product = {};
          pkey._id = produit.product;
          this.products$.push(
            this.__o_
              .one$(
                this.objectConfig.property.keys.product.TableName,
                pkey,
                this.objectConfig.property.keys.product.Region
              )
              .pipe(
                flatMap(data => {
                  tmp_product = data;
                  tmp_product["quantity"] = produit.quantity;
                  let taxes$ = [];
                  produit.taxes.map(taxe => {
                    const tkey = JSON.parse(
                      JSON.stringify(this.objectConfig.property.keys.tax.Key)
                    );
                    tkey._id = taxe;
                    taxes$.push(
                      this.__o_.one$(
                        this.objectConfig.property.keys.tax.TableName,
                        tkey,
                        this.objectConfig.property.keys.tax.Region
                      )
                    );
                  });
                  return forkJoin(taxes$);
                }),
                map(data => {
                  tmp_product["taxes"] = data;
                  return tmp_product;
                })
              )
          );
        });
      }

      if (this.objectConfig.services) {
        const skey = JSON.parse(
          JSON.stringify(this.objectConfig.property.keys.service.Key)
        );
        this.objectConfig.services.map(service => {
          let tmp_service = {};
          skey._id = service.product;
          this.products$.push(
            this.__o_
              .one$(
                this.objectConfig.property.keys.service.TableName,
                skey,
                this.objectConfig.property.keys.service.Region
              )
              .pipe(
                flatMap(data => {
                  tmp_service = data;
                  tmp_service["quantity"] = service.quantity;

                  let taxes$ = [];
                  service.taxes.map(taxe => {
                    const tkey = JSON.parse(
                      JSON.stringify(this.objectConfig.property.keys.tax.Key)
                    );
                    tkey._id = taxe;
                    taxes$.push(
                      this.__o_.one$(
                        this.objectConfig.property.keys.tax.TableName,
                        tkey,
                        this.objectConfig.property.keys.tax.Region
                      )
                    );
                  });
                  return forkJoin(taxes$);
                }),
                map(data => {
                  tmp_service["taxes"] = data;
                  return tmp_service;
                })
              )
          );
        });
      }

      if (this.objectConfig.produitslibre) {
        this.objectConfig.produitslibre.map(produit => {
          let tmp_product_libre = produit;
          tmp_product_libre["taxes"] = [];
          produit.taxes.map(taxe => {
            const tkey = JSON.parse(
              JSON.stringify(this.objectConfig.property.keys.tax.Key)
            );
            tkey._id = taxe;
            this.products$.push(
              this.__o_
                .one$(
                  this.objectConfig.property.keys.tax.TableName,
                  tkey,
                  this.objectConfig.property.keys.tax.Region
                )
                .pipe(
                  map(data => {
                    tmp_product_libre["taxes"].push(data);
                    return tmp_product_libre;
                  })
                )
            );
          });
        });
      }

      if (this.products$.length > 0) {
        return forkJoin(this.products$);
      } else {
        return empty();
      }
    }
  }

  toDataUrl(url, callback) {
    if (this.isBrowser) {
      let xhr = new XMLHttpRequest();
      xhr.onload = function() {
        let reader = new FileReader();
        reader.onloadend = function() {
          callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    }
  }

  /* 
    Wilaya: 'Alger'
    adresse: '06 Rue Bendaoued Ahmed'
    article: '178682-09090209-009'
    database: 'config'
    email: 'contact@smartelectronicx.com'
    nif: '7787783-009093-009'
    nis: '99890983-0909003'
    nrc: '90989098A90980'
    phone: '0555 565 678'
    phonefax: '023 23 23 23'
    phonefixe: '023 23 23 23'
    postalecode: '16000'
    raisonsociale: 'Eurl smartelectronicx'
    tva: '19'
    ville: 'Bab ahcen'
    wilaya: 'Alger' */

  /*   Pays: 'algerie'
    Ville: 'Tipaza'
    active: true
    address: '10 Rue Bendaoued Ahmed Hadjout'
    article: '7657656565798789879'
    assujetitva: true
    author: 'smart@knewtone.com'
    capital: '3000000'
    date_add: 1541721600000
    date_upd: 1541721600000
    departement: 'tipaza'
    description: 'description ou note sur le client.'
    email: ['temkit.ali@gmail.com']
    fjuridique: 'SARL'
    name: 'Renault'
    nif: '98789879'
    nis: 'ç878798'
    phone: ['0555988732']
    postcode: '42200'
    rc: '6576tyuyt786765765'
    type: 'client'
    website: 'smartelectronicx.com'
    _id: 'smart-c-10136-587' */

  private initfile() {
    if (this.isBrowser) {
      this.pdf = {
        header: {
          columns: [
            { text: "", style: "documentHeaderLeft" },
            { text: "", style: "documentHeaderCenter" },
            { text: "", style: "documentHeaderRight" }
          ]
        },
        footer: {
          columns: [
            { text: "", style: "documentFooterLeft" },
            { text: "", style: "documentFooterCenter" },
            { text: "", style: "documentFooterRight" }
          ]
        },
        content: [
          // Header
          {
            columns: [
              {
                image: this.logo,
                width: 150
              },

              [
                {
                  text: this.objectConfig.type,
                  style: "invoiceTitle",
                  width: "*"
                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: "Référence",
                          style: "invoiceSubTitle",
                          width: "*"
                        },
                        {
                          text: this.objectConfig.reference,
                          style: "invoiceSubValue",
                          width: 100
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          text: "Date",
                          style: "invoiceSubTitle",
                          width: "*"
                        },
                        {
                          text: this.objectConfig.date_commande,
                          style: "invoiceSubValue",
                          width: 100
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          text: "Validité",
                          style: "invoiceSubTitle",
                          width: "*"
                        },
                        {
                          text: this.objectConfig.valide,
                          style: "invoiceSubValue",
                          width: 100
                        }
                      ]
                    }
                  ]
                }
              ]
            ]
          },
          // Billing Headers
          {
            columns: [
              {
                text: "De",
                style: "invoiceBillingTitle"
              },
              {
                text: "Á",
                style: "invoiceBillingTitle"
              }
            ]
          },
          // Billing Details
          {
            columns: [
              {
                text: this.company.raisonsociale,
                style: "invoiceBillingDetails"
              },
              {
                text: this.customer.name,
                style: "invoiceBillingDetails"
              }
            ]
          },
          // Billing Address Title
          {
            columns: [
              {
                text: "Adresse",
                style: "invoiceBillingAddressTitle"
              },
              {
                text: "Adresse",
                style: "invoiceBillingAddressTitle"
              }
            ]
          },
          // Billing Address
          {
            columns: [
              {
                text:
                  this.company.adresse +
                  "\n" +
                  this.company.ville +
                  ", " +
                  this.company.postalecode +
                  "\n" +
                  this.company.wilaya,
                style: "invoiceBillingAddress"
              },
              {
                text:
                  this.customer.address +
                  "\n" +
                  this.customer.ville +
                  ", " +
                  this.customer.postcode +
                  "\n" +
                  this.customer.wilaya +
                  " " +
                  this.customer.pays,
                style: "invoiceBillingAddress"
              }
            ]
          },
          // Line breaks
          "\n\n",
          // Items
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*", 40, "auto", 40, "auto", 80],

              body: this.pdfTable
            } // table
            //  layout: 'lightHorizontalLines'
          },
          // TOTAL
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: ["*", 80],

              body: [
                // Total
                [
                  {
                    text: "Total HT",
                    style: "itemsFooterSubTitle"
                  },
                  {
                    text: this.subtotale.toFixed(2) + " DZD",
                    style: "itemsFooterSubValue"
                  }
                ],
                [
                  {
                    text: "Total Taxes",
                    style: "itemsFooterSubTitle"
                  },
                  {
                    text: this.taxtotale.toFixed(2) + " DZD",
                    style: "itemsFooterSubValue"
                  }
                ],
                [
                  {
                    text: "TOTAL TTC",
                    style: "itemsFooterTotalTitle"
                  },
                  {
                    text: (this.taxtotale + this.subtotale).toFixed(2) + " DZD",
                    style: "itemsFooterTotalValue"
                  }
                ]
              ]
            }, // table
            layout: "lightHorizontalLines"
          },
          // Signature
          {
            columns: [
              {
                text: ""
              },
              {
                stack: [
                  {
                    text: "_________________________________",
                    style: "signaturePlaceholder"
                  },
                  {
                    text: "Your Name",
                    style: "signatureName"
                  },
                  {
                    text: "Your job title",
                    style: "signatureJobTitle"
                  }
                ],
                width: 180
              }
            ]
          },
          {
            text: "NOTES",
            style: "notesTitle"
          },
          {
            text: this.convertNumberToWords(this.subtotale + this.taxtotale),
            style: "notesText"
          }
        ],
        styles: {
          // Document Header
          documentHeaderLeft: {
            fontSize: 10,
            margin: [5, 5, 5, 5],
            alignment: "left"
          },
          documentHeaderCenter: {
            fontSize: 10,
            margin: [5, 5, 5, 5],
            alignment: "center"
          },
          documentHeaderRight: {
            fontSize: 10,
            margin: [5, 5, 5, 5],
            alignment: "right"
          },
          // Document Footer
          documentFooterLeft: {
            fontSize: 10,
            margin: [5, 5, 5, 5],
            alignment: "left"
          },
          documentFooterCenter: {
            fontSize: 10,
            margin: [5, 5, 5, 5],
            alignment: "center"
          },
          documentFooterRight: {
            fontSize: 10,
            margin: [5, 5, 5, 5],
            alignment: "right"
          },
          // Invoice Title
          invoiceTitle: {
            fontSize: 22,
            bold: true,
            alignment: "right",
            margin: [0, 0, 0, 15]
          },
          // Invoice Details
          invoiceSubTitle: {
            fontSize: 12,
            alignment: "right"
          },
          invoiceSubValue: {
            fontSize: 12,
            alignment: "right"
          },
          // Billing Headers
          invoiceBillingTitle: {
            fontSize: 14,
            bold: true,
            alignment: "left",
            margin: [0, 20, 0, 5]
          },
          // Billing Details
          invoiceBillingDetails: {
            alignment: "left"
          },
          invoiceBillingAddressTitle: {
            margin: [0, 7, 0, 3],
            bold: true
          },
          invoiceBillingAddress: {},
          // Items Header
          itemsHeader: {
            margin: [0, 5, 0, 5],
            bold: true
          },
          // Item Title
          itemTitle: {
            bold: true
          },
          itemSubTitle: {
            italics: true,
            fontSize: 11
          },
          itemNumber: {
            margin: [0, 5, 0, 5],
            alignment: "center"
          },
          itemTotal: {
            margin: [0, 5, 0, 5],
            bold: true,
            alignment: "center"
          },

          // Items Footer (Subtotal, Total, Tax, etc)
          itemsFooterSubTitle: {
            margin: [0, 5, 0, 5],
            bold: true,
            alignment: "right"
          },
          itemsFooterSubValue: {
            margin: [0, 5, 0, 5],
            bold: true,
            alignment: "center"
          },
          itemsFooterTotalTitle: {
            margin: [0, 5, 0, 5],
            bold: true,
            alignment: "right"
          },
          itemsFooterTotalValue: {
            margin: [0, 5, 0, 5],
            bold: true,
            alignment: "center"
          },
          signaturePlaceholder: {
            margin: [0, 70, 0, 0]
          },
          signatureName: {
            bold: true,
            alignment: "center"
          },
          signatureJobTitle: {
            italics: true,
            fontSize: 10,
            alignment: "center"
          },
          notesTitle: {
            fontSize: 10,
            bold: true,
            margin: [0, 50, 0, 3]
          },
          notesText: {
            fontSize: 10
          },
          center: {
            alignment: "center"
          }
        },
        defaultStyle: {
          columnGap: 20
        }
      };

      let scope = this;

      pdfMake.createPdf(this.pdf).getDataUrl(function(outDoc) {
        scope.frame.nativeElement.setAttribute("src", outDoc);
      });
    }
  }

  convertNumberToWords(amount) {
    const words = new Array();
    words[0] = "";
    words[1] = "un";
    words[2] = "deux";
    words[3] = "trois";
    words[4] = "quatre";
    words[5] = "cinq";
    words[6] = "six";
    words[7] = "sept";
    words[8] = "huite";
    words[9] = "neuf";
    words[10] = "dix";
    words[11] = "onze";
    words[12] = "douze";
    words[13] = "treize";
    words[14] = "quatorze";
    words[15] = "quinze";
    words[16] = "seize";
    words[17] = "dix-sept";
    words[18] = "dix-huit";
    words[19] = "dix-neuf";
    words[20] = "vight";
    words[30] = "trente";
    words[40] = "quarante";
    words[50] = "cinquante";
    words[60] = "soixante";
    words[70] = "soixante-dix";
    words[71] = "soixante-et-onze";
    words[72] = "soixante-douze";
    words[73] = "soixante-treize";
    words[74] = "soixante-quatorze";
    words[75] = "soixante-quinze";
    words[76] = "soixante-seize";
    words[77] = "soixante-dix-sept";
    words[78] = "soixante-dix-huit";
    words[79] = "soixante-dix-neuf";
    words[80] = "quatre-vingt";
    words[90] = "quatre-vingt-dix";
    words[91] = "quatre-vingt-et-onze";
    words[92] = "quatre-vingt-douze";
    words[93] = "quatre-vingt-treize";
    words[94] = "quatre-vingt-quatorze";
    words[95] = "quatre-vingt-quinze";
    words[96] = "quatre-vingt-seize";
    words[97] = "quatre-vingt-six-sept";
    words[98] = "quatre-vingt-dix-huit";
    words[99] = "quatre-vingt-dix-neuf";
    amount = amount.toString();
    const atemp = amount.split(".");
    const number = atemp[0].split(",").join("");
    const n_length = number.length;
    let words_string = "";
    if (n_length <= 9) {
      const n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const received_n_array = new Array();
      for (let i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (let i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (let i = 0, j = 1; i < 9; i++, j++) {
        if (i === 0 || i === 2 || i === 4 || i === 7) {
          if (n_array[i] === 1) {
            n_array[j] = 10 + parseInt(n_array[j] + "");
            n_array[i] = 0;
          }
        }
      }
      let value = 0;
      for (let i = 0; i < 9; i++) {
        if (i === 0 || i === 2 || i === 4 || i === 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value !== 0) {
          words_string += words[value] + " ";
        }
        if (
          (i === 1 && value !== 0) ||
          (i === 0 && value !== 0 && n_array[i + 1] === 0)
        ) {
          words_string += "Crores ";
        }
        if (
          (i === 3 && value !== 0) ||
          (i === 2 && value !== 0 && n_array[i + 1] === 0)
        ) {
          words_string += "Lakhs ";
        }
        if (
          (i === 5 && value !== 0) ||
          (i === 4 && value !== 0 && n_array[i + 1] === 0)
        ) {
          words_string += "Milles ";
        }
        if (
          i === 6 &&
          value !== 0 &&
          n_array[i + 1] !== 0 && n_array[i + 2] !== 0
        ) {
          words_string += "cent et ";
        } else if (i === 6 && value !== 0) {
          words_string += "Cent ";
        }
      }
      words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }
}
