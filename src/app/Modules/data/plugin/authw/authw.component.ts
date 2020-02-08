import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { switchMap, map, flatMap } from "rxjs/operators";
import { AuthService } from "src/app/private/aws/auth.service";
import { CognitoService } from "src/app/private/aws/cognito.service";
import { empty } from "rxjs";

@Component({
  selector: "app-authw",
  templateUrl: "./authw.component.html",
  styleUrls: ["./authw.component.css"]
})
export class AuthwComponent implements OnInit {
  _state_;
  @Input() route;
  @Input() queryParams;
  @Input() logo;
  @Input() loginMessage;
  @Input() go;
  @Input() state;

  message = null;
  spec;
  domain;
  group;
  goto = "go";
  color;
  username;
  error;

  load;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cognito: CognitoService
  ) {
    this.domain = localStorage.getItem("domain");
    this.spec = JSON.parse(localStorage.getItem("spec"));
  }

  ngOnInit(): void {
    this.load = this.authService.isAuthenticated().pipe(
      map(data => {
        if (data) {
          this.group = localStorage.getItem("group");
          this.router.navigate([this.spec.route], {
            queryParams: this.spec.queryParams[this.group]
          });
          return false;
        }

        return empty();
      })
    );
  }

  signIn(username, password) {
    this.username = this.authService.cleanUserName(username);

    this.authService
      .signIn(username, password)
      .pipe(
        flatMap((data: any) => {
          if (data.challengeName === "NEW_PASSWORD_REQUIRED") {
            this.username = data;
            this.setTmplate("change");

            return empty();
          }
          localStorage.setItem(
            "group",
            data.signInUserSession.accessToken.payload["cognito:groups"]
          );
          this.group =
            data.signInUserSession.accessToken.payload["cognito:groups"];
          return this.authService.getData(data);
        }),
        map(data => {
          if (data) {
            data.map(attribute => {
              if (attribute.Name === "custom:id") {
                this.authService.Cache.setItem("id", attribute.Value);
              }
            });

            this.authService.Cache.setItem("user", this.username);

            this.authService.Cache.setItem("logo", this.logo);
          }

          return data;
        })
      )
      .subscribe(
        auth => {
          if (auth && this.goto === "go") {
            this.router.navigate([this.route], {
              queryParams: this.spec.queryParams[this.group]
            });
          } else if (this.goto !== "go") {
            this.setTmplate("loged");
          }
        },
        err => {
          this.error = err;
          if (err.name === "UserNotConfirmedException") {
            this.setTmplate("confirm");
            this.authService.sendConfirmation(username).subscribe(data => {});
          }
        }
      );
  }

  changePassword(password1, password2) {
    if (password1 === password2) {
      this.authService
        .changePassword(this.username, password1)
        .subscribe((data: any) => {
          if (data.username) {
            this.message =
              "Votre mot de passe à été modifier avec succes, vous allez être rediriger vers votre tableau de bord ...";
            localStorage.setItem(
              "group",
              data.signInUserSession.accessToken.payload["cognito:groups"]
            );
            this.group =
              data.signInUserSession.accessToken.payload["cognito:groups"];

            setTimeout(() => {
              this.router.navigate([this.route], {
                queryParams: this.spec.queryParams[this.group]
              });
            }, 3000);
          }
        });
    } else {
      this.error = "Les deux mots de passes ne corréspondent pas !";
    }
  }

  forgotPassword(username) {
    this.username = username;
    this.authService.forgotPassword(username).subscribe(
      (data: any) => {
        if (data.CodeDeliveryDetails.DeliveryMedium === "EMAIL") {
          this.message =
            "Vous avez reçu un email afin de récupérer votre mot de passe sur : " +
            data.CodeDeliveryDetails.Destination;
          this.setTmplate("confirmChange");
        }
      },
      err => {
        console.log(err);
        this.error = err;
      }
    );
  }

  confirmForgotPassword(password1, password2, code) {
    if (password1 === password2) {
      this.authService
        .confirmForgotPassword(this.username, code, password1)
        .subscribe((data: any) => {
          this.setTmplate("login");
          this.message =
            "Votre mot de passe à été modifier avec succés ! Connectez vous ";
        });
    } else {
      this.error = "Confirmation du mot de passe incorrect";
    }
  }

  confirmAccount(username, code) {
    this.authService.confirmSignUp(username, code).subscribe(
      auth => {
        this.setTmplate("login");
        this.message = "Votre compte à été confirmé ! Connectez vous ";
      },
      err => {
        console.log(err);
        this.error = err;
      }
    );
  }

  signUp(phone, email, passworUp, name, given_name, newsletter) {
    this.spec.required.map(required => {
      if (required === "email") {
        this.username = this.authService.cleanUserName(email);
      } else {
        this.username = this.authService.cleanUserName(phone);
      }
    });

    newsletter = newsletter ? 1 : 0;

    this.authService
      .signUp(
        this.username,
        email,
        phone,
        passworUp,
        name,
        given_name,
        newsletter
      )
      .pipe(
        map(data => {
          return data;
        })
      )
      .subscribe(
        auth => {
          this.setTmplate("confirm");
        },
        err => {
          console.log(err);
          this.error = err;
        }
      );
  }

  confirm(code) {
    this.authService.confirmSignUp(this.username, code).subscribe(
      data => {
        if (data === "SUCCESS") {
          this.setTmplate("login");
        } else {
        }
      },
      err => {
        this.error = err;
      }
    );
  }

  sendConfirmaiton() {
    this.authService.sendConfirmation(this.username).subscribe(data => {});
  }

  setTmplate(what) {
    this.state = what;

    if (what === "create" && !this.spec.create) {
      this.message =
        "Contactez l'adminstrateur de l'application : " + this.spec.domain;
    }
  }
}
