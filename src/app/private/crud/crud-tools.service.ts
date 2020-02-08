import { Injectable } from '@angular/core';
import { isEqualWith } from 'lodash';
const ALPHABET = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9'
];

@Injectable({
  providedIn: 'root'
})
export class CrudToolsService {

  constructor() { }

  public hashCode(string: string) {
    let h = 0;
    for (let i = 0; i < string.length; i++) {
      // tslint:disable-next-line:no-bitwise
      h = Math.imul(31, h) + string.charCodeAt(i) | 0;
    }

    return h;
  }


  public cleanName(name) {
    return name
      .toString()
      .toLowerCase()
      .replace(/,/g, ' ')
      .replace(/ /g, '_')
      .replace(/'/g, '_')
      .replace(/"/g, '_')
      .replace(/ç/g, '_')
      .replace(/\(/g, '_')
      .replace(/\//g, '_')
      .replace(/\µ/g, '_')
      .replace(/\)/g, '_')
      .replace(/\[/g, '_')
      .replace(/\]/g, '_')
      .replace(/é/g, 'e')
      .replace(/à/g, 'e')
      .replace(/è/g, 'e')
      .replace(/â/g, 'e')
      .replace(/ç/g, 'c')
      .replace(/û/g, 'e')
      .replace(/ê/g, 'e')
      .replace(/-/g, '_')
      .replace(/&/g, 'et');
  }

  public makeID(length) {
    let _id = '';
    for (let i = 0; i <= length; i++) {
      _id = _id + ALPHABET[Math.floor(Math.random() * 54 + 0)];
    }
    return _id;
  }

  public uuid() {
    let uuid = '',
      i,
      random;
    for (i = 0; i < 32; i++) {
      // tslint:disable-next-line:no-bitwise
      random = (Math.random() * 16) | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
    }
    return uuid;
  }

  public id(length) {
    let id = '',
      i,
      random;
    for (i = 0; i < length; i++) {
      // tslint:disable-next-line:no-bitwise
      random = (Math.random() * 16) | 0;
      id += i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random;
    }
    // tslint:disable-next-line:radix
    return parseInt(id);
  }


  public isDifferent(oldForm, newForm) {
    return isEqualWith(
      oldForm,
      newForm,
      this.customizer
    );
  }

  private customizer(objValue, othValue) {
    if (
      (objValue === undefined && othValue === false) ||
      '<p>' + objValue + '</p>' === othValue
    ) {
      return true;
    }
  }

}
