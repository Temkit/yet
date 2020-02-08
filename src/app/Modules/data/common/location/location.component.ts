import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { isPlatformBrowser } from "@angular/common";

declare let mapboxgl, MapboxGeocoder;

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class LocationComponent implements AfterViewInit {
  objectConfig;

  @Output() patch: EventEmitter<object> = new EventEmitter<object>();
  @Input() value;

  themap;
  marker;
  isBrowser;

  @ViewChild("mapElement", { static: false }) mapElement: ElementRef;
  @ViewChild("coordinates", { static: false }) coordinatesElement: ElementRef;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.value =
        this.value === "null"
          ? [2.8580294, 36.6958466]
          : JSON.parse(this.value);

      const scope = this;
      mapboxgl.accessToken =
        "pk.eyJ1Ijoia25ld3RvbmUiLCJhIjoiY2pudDRucm51MGowdjNxczVlZmRiaW56bCJ9.iweLn6al5rzYSZrrVMRP9A";

      this.themap = new mapboxgl.Map({
        container: this.mapElement.nativeElement, // container id
        style: "mapbox://styles/mapbox/streets-v10",
        center: this.value,
        zoom: 16,
        attributionControl: false
      });

      this.themap.on("load", function() {
        (document
          .getElementsByClassName("mapboxgl-ctrl-bottom-left")
          .item(0) as HTMLElement).style.display = "none";

        setTimeout(() => {
          scope.themap.resize();
        }, 2000);
      });

      this.marker = new mapboxgl.Marker({
        draggable: true
      })
        .setLngLat(this.value ? this.value : [2.8580294, 36.6958466])
        .addTo(this.themap);

      this.marker.on("dragend", function() {
        const lngLat = scope.marker.getLngLat();
        scope.emit([lngLat.lng, lngLat.lat]);
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        language: "fr",
        country: "dz"
      });

      const locator = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserLocation: false
      });

      this.themap.addControl(geocoder, "top-left");
      this.themap.addControl(locator, "top-right");

      // After the map style has loaded on the page, add a source layer and default
      // styling for a single point.
      this.themap.on("load", function() {
        // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
        // makes a selection and add a symbol that matches the result.
        geocoder.on("result", function(ev) {
          scope.marker.setLngLat(ev.result.center);
          scope.emit(ev.result.center);
          scope.themap.getSource("single-point").setData(ev.result.geometry);
        });

        locator.on("geolocate", function(ev) {
          scope.emit([ev.coords.longitude, ev.coords.latitude]);
          scope.marker.setLngLat([ev.coords.longitude, ev.coords.latitude]);
        });
      });
    }
  }

  emit(data) {
    this.patch.emit({ coords: data });
  }
}
