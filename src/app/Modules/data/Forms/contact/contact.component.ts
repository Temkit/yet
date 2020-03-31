import { CreateService } from "./../../../../private/crud/create.service";
import { Component, OnInit } from "@angular/core";

import Auth from "@aws-amplify/auth";
import { S3Service } from "./../../../../private/aws/s3.service";
import { map } from "rxjs/operators";
@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"]
})
export class ContactComponent implements OnInit {
  name: string;
  email: string;
  message: string;
  phone: string;
  raison_sociale: string;

  domain;
  link;
  spec;
  load;
  constructor(private __c_: CreateService, private S3Service: S3Service) {
    this.domain = localStorage.getItem("domain");
    this.link = localStorage.getItem("group");
  }

  ngOnInit() {
    this.load = this.S3Service.getSpec(
      this.domain + "/" + this.link + "/contact.form.json"
    ).pipe(
      map((data: any) => {
        this.spec = JSON.parse(data.Body.toString());
        return data;
      })
    );
  }

  processForm() {
    const item = Object.assign({}, this.spec.Key, {
      name: this.name,
      raison_sociale: this.raison_sociale,
      email: this.email,
      phone: this.phone,
      message: this.message
    });

    this.__c_
      .create$(this.spec.TableName, item, this.spec.Region)
      .subscribe(data => {
        alert("Votre message à été envoyer avec succès.");

        this.name = "";
        this.phone = "";
        this.raison_sociale = "";
        this.message = "";
        this.email = "";
      });
  }
}
