import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { S3Service } from "src/app/private/aws/s3.service";
import { AuthService } from "src/app/private/aws/auth.service";
import * as ClassicEditor from "./../../../../../assets/ckeditor/ckeditor";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"],
})
export class EditorComponent implements OnInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();
  public Editor = ClassicEditor;

  objectconfig;

  @Input() value = "";
  @Input() set config(val) {
    this.objectconfig = JSON.parse(val);
  }

  load;
  height;

  constructor(private s3service: S3Service, private auth: AuthService) {}

  ngOnInit(): void {}

  emit() {
    let obj = {};
    obj[this.objectconfig.name] = this.value ? this.value : "<p></p>";
    this.patch.emit(obj);
  }
}
