import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

declare let mapboxgl;

@Component({
  selector: "app-polygone",
  templateUrl: "./polygone.component.html",
  styleUrls: ["./polygone.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class PolygoneComponent implements AfterViewInit {
  @Input() set config(value) {
    if (value) {
      this.objectConfig = JSON.parse(value);
    }
  }

  @Input() set value(value) {
    if (value) {
      this.points = JSON.parse(value);
    } else {
      this.points = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ];
    }
  }

  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  @ViewChild("mapElement", { static: false }) mapElement: ElementRef;
  @ViewChild("coordinates", { static: false }) coordinatesElement: ElementRef;
  points = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  objectConfig;
  themap;
  marker;
  isBrowser;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      const scope = this;

      mapboxgl.accessToken =
        "pk.eyJ1Ijoia25ld3RvbmUiLCJhIjoiY2pudDRucm51MGowdjNxczVlZmRiaW56bCJ9.iweLn6al5rzYSZrrVMRP9A";

      scope.themap = new mapboxgl.Map({
        container: scope.mapElement.nativeElement, // container id
        style: "mapbox://styles/mapbox/streets-v11",
        center: [2.913757, 36.762012],
        zoom: 4,
        attributionControl: false,
      });

      const locator = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserLocation: false,
      });

      scope.themap.on("load", function () {
        scope.themap.addControl(locator, "top-right");

        scope.themap.addControl(new mapboxgl.NavigationControl());
        if (scope.points.length > 1) {
          scope.themap.addLayer({
            id: scope.objectConfig.name,
            type: "fill",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [scope.points],
                },
              },
            },
            layout: {},
            paint: {
              "fill-color": "#ff00bc",
              "fill-opacity": 0.4,
            },
          });
        } else {
          scope.marker = new mapboxgl.Marker({
            draggable: false,
          })
            .setLngLat(
              scope.points[0] ? scope.points[0] : [2.8580294, 36.6958466]
            )
            .addTo(scope.themap);

          scope.marker.on("dragend", function () {
            const lngLat = scope.marker.getLngLat();
          });

          locator.on("geolocate", function (ev) {
            scope.marker.setLngLat([ev.coords.longitude, ev.coords.latitude]);
          });
        }

        (document
          .getElementsByClassName("mapboxgl-ctrl-bottom-left")
          .item(0) as HTMLElement).style.display = "none";

        setTimeout(() => {
          scope.themap.resize();
        }, 2000);
      });
    }
  }

  addLayer() {
    let obj = {};
    obj[this.objectConfig.name] = this.points;
    // this.themap.getSource(this.name)._data.geometry.coordinates = [this.points];
    this.patch.emit(obj);
  }

  addCoord() {
    if (this.objectConfig.multiple === true || this.points.length === 0) {
      this.points.push([0, 0]);
    } else {
      alert("Vous ne pouvez ajouter qu'un seul point !");
    }
  }

  delCoord(i) {
    this.points.splice(i, 1);
  }
}
