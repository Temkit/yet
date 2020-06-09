import { Injectable } from "@angular/core";
import * as AWS from "aws-sdk";
import { Observable, forkJoin } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const header = new HttpHeaders({
  "content-type": "application/json",
  "x-api-key": "yoWdyAcVah26yYguY2dkzNzVv7KzrFV4mQAfSyCi",
});

@Injectable({
  providedIn: "root",
})
export class SEService {
  private ses;
  interval;
  i;

  tosend$ = [];

  constructor(private http: HttpClient) {}

  sendEMAILs(emailstoSend, email, object, domain) {
    this.tosend$ = [];
    return new Observable((observer) => {
      this.interval = setInterval(
        this.sendemail.bind(this),
        50,
        [],
        [],
        emailstoSend,
        email,
        object,
        [""],
        [object, domain],
        observer
      );
    });
  }

  private sendemail(bcc, cc, to, html, subject, replyTo, source, observer) {
    const start = this.i;
    if (this.i === to.length) {
      clearInterval(this.interval);
      forkJoin(this.tosend$).subscribe((data) => {
        observer.next();
        observer.complete();
      });
    } else if (this.i + 14 < to.length) {
      this.i = this.i + 14;
      this.addToSend(bcc, cc, html, subject, source, to.slice(start, this.i));
    } else {
      this.i = to.length;
      this.addToSend(bcc, cc, html, subject, source, to.slice(start, this.i));
    }
  }

  private addToSend(bcc, cc, html, subject, source, to) {
    this.tosend$.push(
      this.http.post(
        "https://0yym76ym2g.execute-api.eu-west-3.amazonaws.com/ym1/email/s",
        {
          bcc: to.slice(1),
          cc: cc,
          html: html,
          replyTo: [],
          source: source,
          subject: subject,
          to: [to[0]],
        },
        { headers: header }
      )
    );
  }

  sendEmail(bcc, cc, html, subject, source, to) {
    return this.http.post(
      "https://0yym76ym2g.execute-api.eu-west-3.amazonaws.com/ym1/email/s",
      {
        bcc: bcc,
        cc: cc,
        html: html,
        replyTo: [],
        source: source,
        subject: subject,
        to: to,
      },
      { headers: header }
    );
  }

  sendEmailAttachement(to, html, subject, replyTo, source, file) {
    const emailData = {
      filename: file.name,
      path: file,
      to: to,
      html: html,
      subject: subject,
      source: source,
    };

    const url = "https://knewt.one/go/email/attachement";
    this.http.post(url, emailData).subscribe((res) => console.log(res));
  }
}
