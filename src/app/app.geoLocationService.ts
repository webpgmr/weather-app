import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';

@Injectable()
export class GeolocationService {

    public geoLocation;

    constructor(
      private http: HttpClient,
      public service: AppService
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
      this.service.displayError = undefined;
        return Observable.create((observer: Observer<Position>) => {
            // Invokes getCurrentPosition method of Geolocation API.
            navigator.geolocation.getCurrentPosition(
                (position: Position) => {
                    observer.next(position);
                    observer.complete();
                },
                (error: PositionError) => {
                    console.log('Geolocation service: ' + error.message);
                    this.service.displayError = error.message;
                    observer.error(error);
                }
            );
        });
    }

}
