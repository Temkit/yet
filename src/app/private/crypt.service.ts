import { Injectable } from "@angular/core";
const aesjs = require("aes-js");
const key_256 = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];

@Injectable({
  providedIn: "root",
})
export class CryptService {
  aesCtr;
  s;
  constructor() {
    this.aesCtr = new aesjs.ModeOfOperation.ctr(key_256);
  }

  encrypt(data) {
    const textBytes = aesjs.utils.utf8.toBytes(data);
    const encryptedBytes = this.aesCtr.encrypt(textBytes);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  }

  decrypt(data) {
    const encryptedBytes = aesjs.utils.hex.toBytes(data);
    const decryptedBytes = this.aesCtr.decrypt(encryptedBytes);
    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
  }
}
