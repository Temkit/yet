import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
@Pipe({
  name: "sanitize"
})
export class SanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    let img = this.sanitizer.bypassSecurityTrustUrl(value);

    return img;
  }
}
