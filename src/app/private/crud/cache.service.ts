import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

interface CacheContent {
  expiry: number;
  value: any;
}

/**
 * Cache Service is an observables based in-memory cache implementation
 * Keeps track of in-flight observables and sets a default expiry for cached values
 * @export
 * @class CacheService
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {


  private active = true;

  private inFlightObservables: Map<string, Subject<any>> = new Map<
    string,
    Subject<any>
  >();

  readonly DEFAULT_MAX_AGE: number = 86400000;

  /**
   * Gets the value from cache if the key is provided.
   * If no value exists in cache, then check if the same call exists
   * in flight, if so return the subject. If not create a new
   * Subject inFlightObservable and return the source observable.
   */
  get(
    key: string,
    fallback?: Observable<any>,
    maxAge?: number
  ): Observable<any> | Subject<any> {
    if (this.hasValidCachedValue(key)) {
      // console.log(`%cGetting from cache ${key}`, 'color: green');
      return of(JSON.parse(localStorage.getItem(key)).value);
    }

    if (!maxAge) {
      maxAge = this.DEFAULT_MAX_AGE;
    }

    if (this.inFlightObservables.has(key)) {
      return this.inFlightObservables.get(key);
    } else if (fallback && fallback instanceof Observable) {
      this.inFlightObservables.set(key, new Subject());
      // console.log(`%c Calling api for ${key}`, 'color: purple');
      return fallback.pipe(
        tap(value => {
          this.set(key, value, maxAge);
        })
      );
    } else {
      return Observable.throw('Requested key is not available in Cache');
    }
  }

  /**
   * Sets the value with key in the cache
   * Notifies all observers of the new value
   */
  set(key: string, value: any, maxAge: number = this.DEFAULT_MAX_AGE): void {

    localStorage.setItem(
      key,
      JSON.stringify({ value: value, expiry: Date.now() + maxAge })
    );
    this.notifyInFlightObservers(key, value);
  }

  /**
   * Checks if the a key exists in cache
   */
  has(key: string): boolean {
    return localStorage.getItem(key) != null;
  }


  /**
   * Sets the value with key in the cache
   * Notifies all observers of the new value
   */
  delete(key: string): void {
    if (this.hasValidCachedValue(key)) {
      localStorage.removeItem(key);
    }

    this.notifyInFlightObservers(key, null);
  }

  /**
   * Publishes the value to all observers of the given
   * in progress observables if observers exist.
   */
  private notifyInFlightObservers(key: string, value: any): void {
    if (this.inFlightObservables.has(key)) {
      const inFlight = this.inFlightObservables.get(key);
      const observersCount = inFlight.observers.length;
      if (observersCount) {
        /* console.log(
          `%cNotifying ${inFlight.observers
            .length} flight subscribers for ${key}`,
          'color: blue'
        ); */
        inFlight.next(value);
      }
      inFlight.complete();
      this.inFlightObservables.delete(key);
    }
  }

  /**
   * Checks if the key exists and   has not expired.
   */
  private hasValidCachedValue(key: string): boolean {
    if (this.has(key)) {
      if (JSON.parse(localStorage.getItem(key)).expiry < Date.now()) {
        localStorage.removeItem(key);
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  public set cache(active) {
    this.active = active;
  }
}
