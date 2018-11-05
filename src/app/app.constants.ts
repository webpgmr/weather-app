import { environment } from '../environments/environment';

export class AppConstants {

  weatherAPIUrl: string;
  forecastAPIUrl: string; // '&appid=2277007ea6c1a27474744adcc8c89ef8'

  constructor() {
    this.weatherAPIUrl = 'http://api.openweathermap.org/data/2.5/weather';
    this.forecastAPIUrl = 'http://api.openweathermap.org/data/2.5/forecast';
  }
}
