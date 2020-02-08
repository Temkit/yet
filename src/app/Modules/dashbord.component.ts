import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  Inject
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { map, retryWhen, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MediaMatcher } from "@angular/cdk/layout";
import { DomSanitizer } from "@angular/platform-browser";
import { MatAccordion } from "@angular/material/expansion";
import { MatSidenav } from "@angular/material/sidenav";
import { AuthService } from "../private/aws/auth.service";
import { CognitoService } from "../private/aws/cognito.service";
import { CartService } from "../private/crud/cart.service";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { GenericRetryStrategyService } from "./../private/genericRetryStrategy.service";
import { S3Service } from "./../private/aws/s3.service";
import { of } from "rxjs";

@Component({
  selector: "app-dashbord",
  templateUrl: "./dashbord.component.html",
  styleUrls: ["./dashbord.component.css"]
})
export class DashbordComponent implements OnInit, OnDestroy {
  domain;

  user;
  role;
  permission;
  status = true;
  logo;
  menu;
  _array = Array;

  config;

  notifications: object[];

  message: object[];
  cart: object;
  account: object;
  userPoolId;
  displayMode: string = "default";
  multi = false;
  group;
  icons;
  link;
  Object;
  show = [false, false, false, false, false, false];
  badges = {};
  marginleft = 194;

  isBrowser;

  shouldRun;
  compagne;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @ViewChild(MatSidenav, { static: false }) sidenav: MatSidenav;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;

  constructor(
    public router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private S3Service: S3Service,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.Object = Object.keys;
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.domain = localStorage.getItem("domain");

    this.link = localStorage.getItem("group");

    if (this.isBrowser) {
      this.shouldRun = [/localhost\:[0-9]+$/, /(^|\.)yet\.marketing$/].some(h =>
        h.test(window.location.host)
      );
    }
  }

  ngOnInit() {
    this.menu = this.S3Service.getSpec(
      this.domain + "/" + this.link + "/menu.json"
    ).pipe(
      map((data: any) => {
        let spec = JSON.parse(data.Body.toString());

        return spec.menu;
      }),
      catchError(error => of(error))
    );

    this.badges["shopping_cart"] = this.cartService.cart.length;

    this.authService.hMessages.asObservable().subscribe(data => {
      this.badges["message"] = Object.keys(data).length;
      this.message = data;
    });

    this.cartService.hCart.asObservable().subscribe((data: any) => {
      this.badges["shopping_cart"] = data.length;
      this.cart = data;
    });

    this.authService.hAccount.asObservable().subscribe(data => {
      this.account = data;
    });

    this.authService.hNotifications.asObservable().subscribe(data => {
      this.badges["notifications"] = Object.keys(data).length;
      this.notifications = data;
    });

    this.config = JSON.parse(localStorage.getItem("spec"));
    this.icons = this.config.header.icons;
    this.logo = this.config.logodashboard;
  }

  sort(a, b) {
    return 0;
  }

  signOut() {
    this.authService.signOut();

    localStorage.removeItem("app");
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleNotificationPanel(icon, event) {
    // routerLink=""

    if (icon === "shopping_cart") {
      this.navigate("data/cart", null);
    } else {
      const tmp = this.show[icon] ? this.show[icon] : false;
      this.show = new Array(this.icons.length).fill(false);
      this.show[icon] = !tmp;

      if (this.isBrowser) {
        this.marginleft = 330 - (window.innerWidth - event.target.offsetLeft);
      }
    }
  }

  navigate(path, queryParams) {
    this.sidenav.close();

    this.router.navigate(["/yet/" + path], {
      queryParams: { item: queryParams },
      relativeTo: this.route
    });
  }

  logout() {
    this.authService.signOut();
    if (this.isBrowser) {
      window.location.href = "";
    }
  }
}
