import { CryptService } from "./crypt.service";
import { Injectable } from "@angular/core";
const aesjs = require("aes-js");

@Injectable({
  providedIn: "root",
})
export class IndexDBService {
  constructor(private cryptService: CryptService) {}

  private read = (key) => {
    const textBytes = aesjs.utils.utf8.toBytes(key);
    key = aesjs.utils.hex.fromBytes(textBytes);

    let data = localStorage.getItem(key);
    //data = this.cryptService.decrypt(data);
    return data;
  };

  private add = (key, item) => {
    //item = this.cryptService.encrypt(item);

    const textBytes = aesjs.utils.utf8.toBytes(key);
    key = aesjs.utils.hex.fromBytes(textBytes);
    localStorage.setItem(key, item);
  };

  remove = (key) => {
    const textBytes = aesjs.utils.utf8.toBytes(key);
    key = aesjs.utils.hex.fromBytes(textBytes);
    localStorage.removeItem(key);
  };

  setValue = (key, item) => {
    this.add(key, item);
  };

  getValue = (key) => {
    return this.read(key);
  };

  clear = () => {
    localStorage.clear();
  };
}
