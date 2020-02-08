import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parse'
})
export class ParsePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value && value.length > 0) {
      value = '"' + value + '"';
      return value;
    } else {
      return '';
    }
  }

}
