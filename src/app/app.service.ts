import { Injectable } from '@angular/core';
import { AppConstants } from './app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AppService  extends AppConstants {

  public isUser = new BehaviorSubject(false);
  public userName = new BehaviorSubject('');
  public userObj: any;
  public displayError: string;
  currentIsUser = this.isUser.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    super();
    this.displayError = undefined;

  }

  changeIsUser(isUser: boolean) {
    this.isUser.next(isUser);
  }

  changeUserName(userName: string) {
    this.userName.next(userName);
  }

  public getDetails(endpoint, succMsg?: string, errMsg?: string): Observable<any> {
    return this.http.get(endpoint).pipe(
      tap(res => this.handleServerResponse(res, succMsg)),
      retry(3),
      catchError(this.handleError(errMsg, []))
    );
  }

  /**
   * Handle the server response for success
   * Decide to show page or continue
   * @param response
   */
  public handleServerResponse(result, message) {
    if (result.cod === '200') {
      console.log(message);
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.error.message}`);
      this.displayError = error.error.message;
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public authenticateUser() {
    if ( this.getFromBrowserStorage('userObj') === null ) {
      this.router.navigate(['/login']);
      return false;
    } else {
      this.changeIsUser(true);
      this.userObj = JSON.parse(this.getFromBrowserStorage('userObj'));
      this.changeIsUser(this.userObj.name);
      return true;
    }
  }
  // Set value in browser storage
  public setToBrowserStorage(key: string, value?: any) {
    sessionStorage.setItem(key, value);
  }

  // get value from browser storage
  public getFromBrowserStorage(key: string): any {
    return sessionStorage.getItem(key);
  }

  public clearBrowserSessions(key?: string ) {
    if (key !== null && key !== '' && key !== undefined) {
      sessionStorage.removeItem(key);
    } else {
      // remove all available session Storage
      const userObj = sessionStorage.getItem('userObj');
      sessionStorage.clear();
      sessionStorage.setItem('userObj', userObj);
    }
  }

  public convertCelsiusToFahrenheit(value) {
    return Math.round(value * 9.0 / 5.0 + 32);
  }

  public convertFahrenheitToCelsius(value) {
      return Math.round((value - 32) * 5.0 / 9.0);
  }

}
