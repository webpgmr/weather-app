import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../app.service';
import { AppConstants } from './../app.constants';
import { GeolocationService } from './../app.geoLocationService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AppConstants implements OnInit, OnDestroy {

  public geoLocation: any;
  public weatherData: any;
  public isData: boolean;
  public subscription: any;
  public weatherIcons: any;
  public temp: string;
  public userObj: any;
  constructor(
    public service: AppService,
    public geolocation: GeolocationService ) {
    super();
    this.geoLocation = undefined;
    this.weatherData = {};
    this.isData = false;
    this.weatherIcons = {
      'Rain': '/assets/icons/rain.png',
      'Clouds': '/assets/icons/clouds.png',
      'Clear': '/assets/icons/clear.png',
      'Sunny': '/assets/icons/sunny.png'
    };
    this.temp = '°F';
  }

  ngOnInit() {
    this.service.displayError = undefined;
    this.weatherData = {'icon': '', 'desc': '', 'temp': '', 'hum': '', 'speed': '', 'dir': '', 'city': '', 'country': ''};
    if (this.service.authenticateUser() ) {
      this.getGeoWeather();
    }
  }

  getGeoWeather() {
    let latitude: number;
    let longitude: number;
    let locSearchUrl: string;
    let weather_API_key: string;
    this.userObj = JSON.parse(this.service.getFromBrowserStorage('userObj'));
    const appId = '&appid=' + this.userObj.api;
    if (  this.userObj.city !== null && this.userObj.city !== ''  && this.userObj.country !== null && this.userObj.country !== '') {
      weather_API_key = 'weather_' + this.userObj.city;
      const weatherAPIData = JSON.parse(this.service.getFromBrowserStorage(weather_API_key));
      const currentDate = new Date();
      if ( currentDate <= weatherAPIData.expiresAt ) {
        this.weatherData = weatherAPIData.weatherData;
      } else {
        locSearchUrl = '?q=' + this.userObj.city + ',' + this.userObj.country + appId ;
        this.getWeatherInfo(locSearchUrl);
      }
    } else {
      if (navigator.geolocation) {
        this.subscription = this.geolocation.getCurrentPosition().subscribe(
            (position: Position) => {
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
              locSearchUrl = '?lat=' + latitude + '&lon=' + longitude + appId ;
              this.getWeatherInfo(locSearchUrl);
            });
      }
    }
  }

  searchWeather(city: string ) {
    console.log(city);
    let weather_API_key: string;
    let locSearchUrl: string;
    if (  this.userObj.city !== null && this.userObj.city !== ''  && this.userObj.country !== null && this.userObj.country !== '') {
      weather_API_key = 'weather_' + this.userObj.city;
      const weatherAPIData = JSON.parse(this.service.getFromBrowserStorage(weather_API_key));
      const currentDate = new Date().getTime();
      if ( currentDate <= weatherAPIData.expiresAt ) {
        this.populateWeatherData(weatherAPIData.weatherData);
      } else {
        this.service.clearBrowserSessions(weather_API_key);
        const appId = '&appid=' + this.userObj.api;
        locSearchUrl = '?q=' + city + appId;
        this.getWeatherInfo(locSearchUrl);
      }
    }
  }

  getWeatherInfo( locSearchUrl: string ) {
    const weatherUrl =  ( locSearchUrl !== null ) ? this.weatherAPIUrl + locSearchUrl  : '';
    let weather_API_key = '';
    this.subscription = this.service.getDetails(weatherUrl).subscribe( res => {
      console.log(res);
      if (res !== null && res.cod === 200) {
        this.populateWeatherData(res);
        this.userObj.city = res.name;
        this.userObj.country = res.sys.country;
        this.service.setToBrowserStorage('userObj', JSON.stringify(this.userObj));
        weather_API_key = 'weather_' + res.name;
        const expires =  ( this.userObj.expiry > 0 ) ? new Date().getTime() + 60000 * this.userObj.expiry : new Date().getTime();
        const sessionObject = {
            expiresAt: expires,
            weatherData: res
        };
        this.service.setToBrowserStorage(weather_API_key, JSON.stringify(sessionObject));
        this.isData = true;
      } else {
        this.weatherData = {};
        this.isData = false;
        this.service.displayError = 'No Data Available';
      }
    });
  }

  populateWeatherData(currentData) {
    const icon = (currentData.weather[0].main ) ?  currentData.weather[0].main : '';
    this.temp = '';
    this.weatherData.icon = (icon) ? this.weatherIcons[icon] : '';
    this.weatherData.desc = (currentData.weather[0].description ) ?  currentData.weather[0].description : '';
    this.weatherData.temp = (currentData.main.temp ) ?  currentData.main.temp : '';
    this.weatherData.hum = (currentData.main.humidity ) ?  currentData.main.humidity : '';
    this.weatherData.speed = (currentData.wind.speed ) ?  currentData.wind.speed : '';
    this.weatherData.dir = (currentData.wind.deg ) ?  currentData.wind.deg : '';
    this.weatherData.city = (currentData.name ) ?  currentData.name : '';
    this.weatherData.country = (currentData.sys.country ) ?  currentData.sys.country : '';
  }

  tempChange(type) {
    if (type === 'c') {
      this.weatherData.temp = this.weatherData.temp-273.15;
      this.temp = '°c';
    } else {
      this.weatherData.temp = (this.weatherData.temp-273.15)*1.8+32;
      this.temp = '°F';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
