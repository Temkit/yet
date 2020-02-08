import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit {
  spec;
  date;

  constructor() {}

  ngOnInit(): void {
    this.date = new Date().getTime();

    this.spec = new Observable(observer => {
      let spec = JSON.parse(localStorage.getItem("spec"));

      observer.next(spec);
      observer.complete();
    });
  }
}
