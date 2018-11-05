import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GeolocationService {

    public geoLocation;

    constructor(
      private http: HttpClient
    ) {
      this.geoLocation = undefined;
    }
    /**
     *
     * Wraps the Geolocation API into an observable.
     *
     * @return An observable of Position
     */
    getCurrentPosition(): Observable<Position> {
        return Observable.create((observer: Observer<Position>) => {
            // Invokes getCurrentPosition method of Geolocation API.
            navigator.geolocation.getCurrentPosition(
                (position: Position) => {
                    observer.next(position);
                    observer.complete();
                },
                (error: PositionError) => {
                    console.log('Geolocation service: ' + error.message);
                    observer.error(error);
                }
            );
        });
    }

}
