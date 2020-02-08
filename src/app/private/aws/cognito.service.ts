import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Observable, pipe, from, bindCallback, bindNodeCallback } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import Auth from "@aws-amplify/auth";
import { AmplifyService } from "aws-amplify-angular";
import * as AWS from "aws-sdk";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class CognitoService {
  spec;
  isBrowser;

  constructor(
    private amplifyService: AmplifyService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.spec = JSON.parse(localStorage.getItem("spec"));
  }

  public createUser(
    name,
    company,
    email,
    phone,
    DesiredDeliveryMediums,
    TemporaryPassword,
    group?
  ) {
    if (this.isBrowser) {
      return from(Auth.currentUserCredentials()).pipe(
        flatMap(credentials => {
          const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            {
              apiVersion: "2016-04-18",
              region: "eu-central-1",
              credentials: credentials
            }
          );

          AWS.config.update({
            apiVersion: "2016-04-18",
            region: "eu-central-1"
          });

          const params = {
            UserPoolId: this.spec.credential.Auth.userPoolId,
            Username: email,
            DesiredDeliveryMediums: [DesiredDeliveryMediums],
            ForceAliasCreation: false,
            MessageAction: "SUPPRESS",
            TemporaryPassword,
            UserAttributes: [
              {
                Name: "custom:name",
                Value: name
              },
              {
                Name: "custom:entreprise",
                Value: company
              },
              {
                Name: "email",
                Value: email
              },
              {
                Name: "email_verified",
                Value: "false"
              },
              {
                Name: "phone_number",
                Value: this.cleanPhone(phone)
              },
              {
                Name: "phone_number_verified",
                Value: "false"
              },
              {
                Name: "custom:domain",
                Value: localStorage.getItem("domain")
              },
              {
                Name: "custom:role",
                Value: "user"
              }
            ]
          };

          const createUserAsObservable = bindNodeCallback(
            cognitoidentityserviceprovider.adminCreateUser.bind(
              cognitoidentityserviceprovider
            )
          );
          return createUserAsObservable(params);
        }),
        flatMap((data: any) => {
          if (group) {
            return this.addUserToGroup(data.User.Username, group);
          }

          return data;
        })
      );
    }
  }

  public listGroup() {
    if (this.isBrowser) {
      return from(Auth.currentUserCredentials()).pipe(
        flatMap(credentials => {
          const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            {
              apiVersion: "2016-04-18",
              region: "eu-central-1",
              credentials: credentials
            }
          );

          AWS.config.update({
            apiVersion: "2016-04-18",
            region: "eu-central-1"
          });

          const params = {
            UserPoolId: this.spec.credential.Auth.userPoolId
          };

          const listGroupAsObservable = bindNodeCallback(
            cognitoidentityserviceprovider.listGroups.bind(
              cognitoidentityserviceprovider
            )
          );
          return listGroupAsObservable(params);
        })
      );
    }
  }

  public addUserToGroup(Username, group) {
    if (this.isBrowser) {
      return from(Auth.currentUserCredentials()).pipe(
        flatMap(credentials => {
          const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            {
              apiVersion: "2016-04-18",
              region: "eu-central-1",
              credentials: credentials
            }
          );

          AWS.config.update({
            apiVersion: "2016-04-18",
            region: "eu-central-1"
          });

          var params = {
            GroupName: group,
            UserPoolId: this.spec.credential.Auth.userPoolId,
            Username: Username
          };

          const addUserToGroupAsObservable = bindNodeCallback(
            cognitoidentityserviceprovider.adminAddUserToGroup.bind(
              cognitoidentityserviceprovider
            )
          );
          return addUserToGroupAsObservable(params);
        })
      );
    }
  }

  public deleteUser(Username) {
    if (this.isBrowser) {
      return from(Auth.currentUserCredentials()).pipe(
        flatMap(credentials => {
          const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            {
              apiVersion: "2016-04-18",
              region: "eu-central-1",
              credentials: credentials
            }
          );

          AWS.config.update({
            apiVersion: "2016-04-18",
            region: "eu-central-1"
          });

          const params = {
            UserPoolId: this.spec.credential.Auth.userPoolId,
            Username: Username
          };

          const deleteUserAsObservable = bindNodeCallback(
            cognitoidentityserviceprovider.adminDeleteUser.bind(
              cognitoidentityserviceprovider
            )
          );
          return deleteUserAsObservable(params);
        })
      );
    }
  }

  public listUsers(
    UserPoolId,
    AttributesToGet,
    limit,
    Filter,
    PaginationToken
  ) {
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
            AttributesToGet: null,
            Limit: limit,
            Filter: Filter,
            PaginationToken: PaginationToken
          };

          return Observable.create(Observer => {
            cognitoidentityserviceprovider.listUsers(params, function(
              err,
              data
            ) {
              if (err) {
                //console.log(err);
                Observer.error(err);
              } else {
                const users = [];
                data.Users.map(u => {
                  // ["custom:id", "gender", "name", "given_name", "email", "phone_number", "locale", "custom:newsletter"]

                  const user = {};
                  user["status"] = u.UserStatus;
                  user["username"] = u.Username;

                  u.Attributes.map(attr => {
                    user[attr.Name] = attr.Value;
                  });

                  users.push(user);
                });

                Observer.next({
                  users: users,
                  PaginationToken: data.PaginationToken
                });
                Observer.complete();
              } // successful response;
            });
          }).pipe(
            flatMap(users => {
              return Observable.create(Observer => {
                const params = {
                  UserPoolId: UserPoolId
                };
                cognitoidentityserviceprovider.describeUserPool(
                  params,
                  function(err, data) {
                    if (err) {
                      // console.log(err, err.stack);
                      Observer.error(err);
                    } else {
                      users["Count"] = data.UserPool.EstimatedNumberOfUsers;
                      Observer.next(users);
                    }
                  }
                );
              });
            })
          );
        })
      );
    }
  }

  public getUser(UserPoolId, username) {
    console.log(UserPoolId, username);
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
            UserPoolId: UserPoolId /* required */,
            Username: username /* required */
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

  queryUser(UserPoolId, AttributesToGet, Filter) {
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
            AttributesToGet: AttributesToGet,
            Filter: Filter
          };

          const listUsersAsObservable = bindNodeCallback(
            cognitoidentityserviceprovider.listUsers.bind(
              cognitoidentityserviceprovider
            )
          );
          return listUsersAsObservable(params);
        })
      );
    }
  }

  cleanPhone(phone) {
    if (phone.toString().length === 9) {
      phone = "+213" + phone;
    } else if (phone.toString().length === 10) {
      phone = "+213" + phone.substring(1);
    } else if (phone.includes("00213")) {
      phone = "+" + phone.substring(2);
    } else if (phone.includes("+2130")) {
      phone = "+213" + phone.substring(5);
    }

    return phone;
  }
}
