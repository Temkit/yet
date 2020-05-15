import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireStorage } from "@angular/fire/storage";
import { from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CrudService {
  credential = {
    type: "service_account",
    project_id: "innpactus",
    private_key_id: "6ca1b34b31b63c6a012f2e9df446e818d4f5633d",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCLWWeSi93UyvV5\n5mHbhyW6RL85ACF5OP0dTEKy+QoFjK1epVfdXeEblZ3BzggpAfrYmtQh8pMl55ki\nguq8N4TFC5REIZ6jU2e7gnEhXeIhLhWXXkjjNBB0ORpt9qqkrNPWZAz9b6K0CMkv\nGXVCeZz2XkUoLn3R4As5nhGOiJv3uFvKQXLZ502eas4BQg5xTAFM/EN8FaSjjgEK\nXQzfGLmWAeWa0x26OdIwp3SpXSDbtsczG4nroEH9WZArctMqjvPwJtjzcB5O+eBF\nBK0YCW5XQvpvsItWI11yBN8MXgJarLBFu+PFVAZojP9H84MKNcGkTmQYyt7m5kWA\nbRmrfKIPAgMBAAECggEACFhRmEGGBqNIVheATr6KwpIxYf8zlEOWtge8+IjYmzlU\nfJYXtIZ6TVgp+xw5Z3NIMEaPrMTFskj9CpDDp169fuI+xz0qd50uWY+g8noqsnbX\nDQf+At5eCeMyIP5Ixh5q6dDk6Rx/FAlMX5uPr/5vlvDjvDT/+oEr3TR22GlTXKh4\nGnRshDwpkOOyBsNiGRsrQii7mtR971UP7CulbnDDSqEsyAVJeRvnvVWaZ9ZWZ7zZ\n0AzlX6hQrtC3rOyBLzvJi6idsy+eTJV2Z1mvIFrDCHbUm0RjfpNq117uNX2thQju\nu2qtEJBSTlFEh8XHMeEHcUo3zbr8Vj0T1ag3rUdlAQKBgQC/Y2fyTZcJ55bFX6uD\nziYPjN4pYVdz3FDPRTQDS/FSNKNW29gVhAk58fnK/9UqrlBhjJgIg+u7iUY91Y7H\nqkxRO/9SVmzox1FBSn9KHIgNjFiPBx+SbC8xGJi98Ta54E7r6luiiky3+r+5trkm\nS6yURZscJg/pmoMB+4puxzwKgQKBgQC6ZI9qKPSYZ36NvYQcHBTgo7AuR21JSZLN\nl91QvevZjL5I97Sg5wjfIbar+1C+m5cRTuUHzaE22TetZepuH6tUwWm8iqTnooeF\n/9FAq4/qzxljYQv6tI6FdG6lCyIqralhj5GcLfn4nOMDBes3HJRduFhk5z7OkQR7\nsCfq5OjEjwKBgGiOSuwxfTEZBuIe6Nlh1qMqJvheSGNwWelR+h9O7rAlN5KtGbhv\nYIb6bad76h2eCyWvpCMKxs62KNyA/baQj47Vgx+dPXRR508O/skjGySjpoHEt3fL\niGB++nrR+z7CjvsNFjCO82iTIQi5DR8huk9qU1mmZY0OL0H3BGKOj3uBAoGAYJdA\nIrl6l4f6cyVk0tRSlV7+K91j6vivlM9AJ1lkYWaoLVQATOmtFUR5T4J7A2vJy3Rh\nB7wt8Sh7y+XmqI7M0K0ySDxo3IjDRlOdcq/1cq9D7tYZyR/MQ6hkti6g1BEOl7o4\nsQC6a3WRxr1IeVTcJf0kAZY8W/uWoSpWZUmevk0CgYEAuXgIeQdwfi4BkZ/6OKLe\nVJuTNL8pNuyII3fmdfgTWoNPjWjsBORu3gh/KiMEIhOGw+MZDNBgezTdTu77HAHk\naKJjhUkSGQ0nNrN+4jjBi2C41FjyQ1CUoCSQt6Jp+xhD5CEJ0mQjWgpifV2vvhdW\niHbQ+mRz8xEsMo3PocALNYI=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-ct6ul@innpactus.iam.gserviceaccount.com",
    client_id: "107616655168926183033",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ct6ul%40innpactus.iam.gserviceaccount.com",
  };

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    public auth: AngularFireAuth
  ) {
    this.auth
      .signInAnonymously()
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  public get = (query) => {
    let __firestore = query.group
      ? this.__firestore_funciton_group_constructor(query)
      : this.__firestore_funciton_constructor(query);

    return from(this.__get(__firestore));
  };

  public getDocument = (path) => {
    return from(this.firestore.doc(path).get());
  };

  public setDocument = (path, item) => {
    return from(this.firestore.doc(path).set(item));
  };

  public count = (query) => {
    let i = 0;
    return query.group
      ? from(this.firestore.collectionGroup(query.path).get())
      : from(this.firestore.collection(query.path).get());
  };

  public put = (query, item) => {
    console.log(query, item);
    return this.firestore.doc(query.path).set(item);
  };

  getFileUrl = (url) => {
    let ref = this.storage.ref(url);
    return ref.getDownloadURL();
  };

  getAllfiles = (url) => {
    let ref = this.storage.ref(url);
    return ref.listAll();
  };

  putFileUrl = (url, file) => {
    let ref = this.storage.ref(url);
    return ref.put(file);
  };

  private __firestore_funciton_constructor = (query) => {
    let __function;
    if (query.previous) {
      __function = this.firestore.collection(query.path, (ref) =>
        ref
          .orderBy(query.orderBy)
          .endBefore(query.startAfter || null)
          .limitToLast(query.limit)
      );
    } else {
      __function = this.firestore.collection(query.path, (ref) =>
        ref
          .orderBy(query.orderBy)
          .startAfter(query.startAfter || null)
          .limit(query.limit)
      );
    }

    return __function;
  };

  private __firestore_funciton_group_constructor = (query) => {
    let __function;
    if (query.previous) {
      __function = this.firestore.collectionGroup(query.path, (ref) =>
        ref
          .orderBy(query.orderBy)
          .endBefore(query.startAfter || null)
          .limitToLast(query.limit)
      );
    } else {
      __function = this.firestore.collectionGroup(query.path, (ref) =>
        ref
          .orderBy(query.orderBy)
          .startAfter(query.startAfter || null)
          .limit(query.limit)
      );
    }

    return __function;
  };

  private __get = async (__firestore) => {
    let item = await __firestore.get();
    return item;
  };

  private __put = async (item, __firestore) => {
    let putAction = await __firestore.set(item);
    return putAction;
  };
}
