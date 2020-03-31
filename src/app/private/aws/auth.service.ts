import { AmplifyService } from "@flowaccount/aws-amplify-angular";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import {
  Observable,
  BehaviorSubject,
  from,
  of,
  pipe,
  Subject,
  ReplaySubject
} from "rxjs";
import { Router } from "@angular/router";
import { tap, map, catchError, flatMap } from "rxjs/operators";
import * as AWS from "aws-sdk";
import Cache from "@aws-amplify/cache";
import { OneService } from "../crud/one.service";
import { CognitoService } from "./cognito.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean>;
  signedIn;
  Cache;
  cognitoCreds: AWS.CognitoIdentityCredentials;

  userAttributes;
  region;
  userPoolId;
  userPoolWebClientId;

  isBrowser;

  public hMessages: ReplaySubject<object[]>;
  public hNotifications: ReplaySubject<object[]>;
  public hAccount: ReplaySubject<object>;

  constructor(
    private router: Router,
    private amplifyService: AmplifyService,
    private cognitoService: CognitoService,
    private __o_: OneService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loggedIn = new BehaviorSubject<boolean>(false);

    if (this.isBrowser) {
      this.Cache = Cache.createInstance({
        itemMaxSize: 3000,
        defaultPriority: 4,
        storage: window.sessionStorage
      });
    }

    this.hMessages = new ReplaySubject<object[]>(1);
    this.hAccount = new ReplaySubject<object>(1);
    this.hNotifications = new ReplaySubject<object[]>(1);
  }

  public signUp(
    username,
    email,
    phone,
    password,
    name,
    given_name,
    newsletter
  ): Observable<any> {
    if (this.isBrowser) {
      return from(
        this.amplifyService.auth().signUp({
          username,
          password,
          attributes: {
            given_name: given_name,
            name: name,
            phone_number: phone,
            email: email
          }
        })
      ).pipe(
        map(data => {
          return data;
        })
      );
    }
  }

  public confirmSignUp(email, code): Observable<any> {
    if (this.isBrowser) {
      return from(this.amplifyService.auth().confirmSignUp(email, code));
    }
  }

  public forgotPassword(username) {
    if (this.isBrowser) {
      return from(this.amplifyService.auth().forgotPassword(username));
    }
  }

  public confirmForgotPassword(username, code, password) {
    if (this.isBrowser) {
      return from(
        this.amplifyService
          .auth()
          .forgotPasswordSubmit(username, code, password)
      );
    }
  }

  public changePassword(username, password): Observable<any> {
    if (this.isBrowser) {
      return from(
        this.amplifyService.auth().completeNewPassword(username, password, [])
      );
    }
  }

  public sendConfirmation(email): Observable<any> {
    if (this.isBrowser) {
      return from(this.amplifyService.auth().resendSignUp(email)).pipe(
        map(data => {
          return data;
        })
      );
    }
  }

  public signIn(username, password): Observable<any> {
    if (this.isBrowser) {
      username = this.cognitoService.cleanPhone(username);

      return from(this.amplifyService.auth().signIn(username, password)).pipe(
        map((data: any) => {
          return data;
        }),
        tap((data: any) => {
          this.userAttributes = data.attributes;
          this.hAccount.next(data.attributes);
        }),
        tap(() => {
          this.loggedIn.next(true);
        })
      );
    }
  }

  public getData(user): Observable<any> {
    if (this.isBrowser) {
      return from(this.amplifyService.auth().userAttributes(user));
    }
  }

  public getCurrentUser(): Observable<any> {
    if (this.isBrowser) {
      return from(this.amplifyService.auth().currentAuthenticatedUser());
    }
  }

  public getIdToken(): Observable<any> {
    if (this.isBrowser) {
      return from(this.amplifyService.auth().currentSession());
    }
  }

  public isAuthenticated(): Observable<boolean> {
    if (this.isBrowser) {
      return from(this.amplifyService.auth().currentAuthenticatedUser()).pipe(
        tap((data: any) => {
          this.userAttributes = data.attributes;
          this.hAccount.next(data.attributes);
          this.loggedIn.next(true);
          return true;
        }),
        catchError(error => {
          this.loggedIn.next(false);
          return of(false);
        })
      );
    }
  }

  public signOut() {
    if (this.isBrowser) {
      from(this.amplifyService.auth().signOut()).subscribe(
        result => {
          this.loggedIn.next(false);
          this.Cache.clear();
          localStorage.clear();
          this.router.navigate(["/"]);
        },
        error => console.log(error)
      );
    }
  }

  public getUser(UserPoolId, username) {
    if (this.isBrowser) {
      return from(this.amplifyService.auth().currentCredentials()).pipe(
        flatMap(credentials => {
          const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            {
              apiVersion: "2016-04-18",
              region: "eu-central-1",
              credentials: this.amplifyService
                .auth()
                .essentialCredentials(credentials)
            }
          );

          const params = {
            UserPoolId: UserPoolId,
            Username: username
          };

          return Observable.create(Observer => {
            cognitoidentityserviceprovider.adminGetUser(params, function(
              err,
              data
            ) {
              if (err) {
                Observer.error(err);
              } else {
                Observer.next(data);
                Observer.complete();
              }
            });
          });
        }),
        pipe(
          map((data: any) => {
            const user = {};
            data.UserAttributes.map(attr => {
              user[attr.Name] = attr.Value;
            });

            return user;
          })
        )
      );
    }
  }

  cleanUserName(username) {
    if (isNaN(username)) {
    } else if (username.toString().length === 9) {
      username = "+213" + username;
    } else if (username.toString().length === 10) {
      username = "+213" + username.substring(1);
    } else if (username.includes("00213")) {
      username = "+" + username.substring(2);
    } else if (username.includes("+2130")) {
      username = "+213" + username.substring(5);
    }

    return username;
  }
}
