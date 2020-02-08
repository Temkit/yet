import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import * as Chart from "chart.js";

@Component({
  selector: "app-global",
  templateUrl: "./global.component.html",
  styleUrls: ["./global.component.css"]
})
export class GlobalComponent implements AfterViewInit {
  ctx;

  _labels_;

  @Input() id;
  @Input() context;
  @Input() type;
  @Input()
  set labels(val) {
    val = val.replace(/\'/gm, '"');
    this._labels_ = JSON.parse(val);
  }
  @Input() label;
  @Input() data;
  @Input() backgroundColor;
  @Input() borderColor;
  @Input() borderWidth;
  @Input() beginAtZero;

  @ViewChild("canvas", { static: false }) canvas: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngAfterViewInit() {
    const canvas: any = this.canvas.nativeElement;

    this.ctx = canvas.getContext(this.context);
    this.ctx.canvas.height = 150;

    const myChart = new Chart(this.ctx, {
      type: this.type,
      data: {
        labels: this._labels_,
        datasets: [
          {
            label: this.label,
            data: JSON.parse(this.data),
            backgroundColor: JSON.parse(this.backgroundColor),
            borderColor: JSON.parse(this.borderColor),
            borderWidth: this.borderWidth
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}
