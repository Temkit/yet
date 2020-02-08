import { CreateService } from "./../../../../private/crud/create.service";
import { Component, OnInit } from "@angular/core";
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
  pharmacie: string;
  constructor(private __c_: CreateService) {}

  ngOnInit() {}

  processForm() {
    this.__c_
      .create$(
        "krdistrimed",
        {
          database: "messages",
          ref: new Date().getTime().toString(),
          name: this.name,
          pharmacie: this.pharmacie,
          email: this.email,
          phone: this.phone,
          message: this.message
        },
        "eu-central-1"
      )
      .subscribe(data => {
        alert("Votre message à été envoyer avec succès.");

        this.name = "";
        this.phone = "";
        this.pharmacie = "";
        this.message = "";
        this.email = "";
      });
  }
}
