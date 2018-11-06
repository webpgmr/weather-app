import { Component, OnInit } from '@angular/core';
import { AppService } from './../app.service';
import { AppConstants } from './../app.constants';
import { GeolocationService } from './../app.geoLocationService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import Chart from 'chart.js';
declare var Chart: any;

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent extends AppConstants implements OnInit {
  public geoLocation: any;
  public foreCastData: any;
  public isData: boolean;
  public userObj: any;
  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;
  public lineChartOptions: any;
  public lineChartType: string;
  public lineChartLegend: boolean;


  constructor(
    public service: AppService,
    public geolocation: GeolocationService,
    public spinner: Ng4LoadingSpinnerService ) {
    super();
    this.geoLocation = undefined;
    this.foreCastData = {};
    this.isData = false;
 }

  ngOnInit() {
    this.spinner.show();
    if (this.service.authenticateUser()) {
      this.getForeCast();
    }
  }

  getForeCast() {
    let latitude: number;
    let longitude: number;
    let locSearchUrl: string;
    let forecast_API_key: string;
    this.userObj = JSON.parse(this.service.getFromBrowserStorage('userObj'));
    const appId = '&appid=' + this.userObj.api;
    if (  this.userObj.city !== null && this.userObj.city !== ''  && this.userObj.country !== null && this.userObj.country !== '') {
      forecast_API_key = 'forecast_' + this.userObj.city;
      const weatherAPIData = JSON.parse(this.service.getFromBrowserStorage(forecast_API_key));
      if (weatherAPIData !== null ) {
        const currentDate = new Date();
        if (currentDate <= weatherAPIData.expiresAt) {
          this.foreCastData = weatherAPIData.forecastData;
          this.populateChartData(this.foreCastData);
          this.spinner.hide();
        } else {
          this.service.clearBrowserSessions(forecast_API_key);
          locSearchUrl = '?q=' + this.userObj.city + ',' + this.userObj.country + appId ;
          this.getforeCastInfo(locSearchUrl);
        }
      } else {
        locSearchUrl = '?q=' + this.userObj.city + ',' + this.userObj.country + appId ;
        this.getforeCastInfo(locSearchUrl);
      }
    } else {
      if (navigator.geolocation) {
        this.geolocation.getCurrentPosition().subscribe(
            (position: Position) => {
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
              locSearchUrl = '?lat=' + latitude + '&lon=' + longitude + appId;
              this.getforeCastInfo(locSearchUrl);
            });
      }
    }

  }

  getforeCastInfo( locSearchUrl: string ) {
    const weatherUrl =  ( locSearchUrl !== null ) ? this.forecastAPIUrl + locSearchUrl  : '';
    this.service.getDetails(weatherUrl).subscribe( res => {
      console.log(res);
      if (res !== null && res.cod === '200') {
        const forecast_API_key = 'forecast_' + res.city.name;
        const expires =  ( this.userObj.expiry > 0 ) ? new Date().getTime() + 60000 * this.userObj.expiry : new Date().getTime();
        const sessionObject = {
            expiresAt: expires,
            forecastData: res
        };
        this.service.setToBrowserStorage(forecast_API_key, JSON.stringify(sessionObject));
        this.foreCastData = res;
        this.populateChartData(res);
        this.spinner.hide();
        this.isData = true;
      } else {
        this.foreCastData = {};
        this.spinner.hide();
        this.isData = false;
        this.service.displayError = 'No Data Available';
      }
    });
  }

  populateChartData( res ) {
    const lists = res.list;
    let chartData = [];
    let chartLabels=  [];
    let date;
    let tempDate: string;

    lists.forEach(function (value) {
      //console.log(value);
      chartData.push(Math.floor(value.main.temp - 273.15)); // converting to Celsius
      date = new Date(value.dt * 1000);
      tempDate = date.getHours() + ':0' + date.getMinutes();
      chartLabels.push(tempDate);
    });
    this.drawChart(chartData, chartLabels);
    console.log(chartData);
    console.log(chartLabels);
  }

  drawChart(data, label) {
    const ctx = "myChart";
    const myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: label,
        datasets: [{
            data: data,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)'
        }]
      },
      options: {
        scales: {
          yAxes: [{
              stacked: true
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }

}
