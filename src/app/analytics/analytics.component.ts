import { Component, OnInit } from '@angular/core';
import { AppService } from './../app.service';
import { AppConstants } from './../app.constants';
import { GeolocationService } from './../app.geoLocationService';
import * as Highcharts from 'highcharts';



@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent extends AppConstants implements OnInit {

  public geoLocation: any;
  public foreCastData: any;
  public isData: boolean;
  public weatherIcons: any;
  public userObj: any;
  constructor(
    public service: AppService,
    public geolocation: GeolocationService ) {
    super();
    this.geoLocation = undefined;
    this.foreCastData = {};
    this.isData = false;
    this.weatherIcons = {
      'Rain': '/assets/icons/rain.png',
      'Clouds': '/assets/icons/clouds.png',
      'Clear': '/assets/icons/clear.png',
      'Sunny': '/assets/icons/sunny.png'
    };
  }

  ngOnInit() {
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
        var highChart = Highcharts.chart('chart_container', {

          chart: {
              scrollablePlotArea: {
                  minWidth: 700
              }
          },
      
          data: {
              
          },
      
          title: {
              text: ''
          },
      
       
          xAxis: {
              tickInterval: 7 * 24 * 3600 * 1000, // one week
              tickWidth: 0,
              gridLineWidth: 1,
              labels: {
                  align: 'left',
                  x: 3,
                  y: -3
              }
          },
      
          yAxis: [{ // left y axis
              title: {
                  text: null
              },
              labels: {
                  align: 'left',
                  x: 3,
                  y: 16,
                  format: '{value:.,0f}'
              },
              showFirstLabel: false
          }, { // right y axis
              linkedTo: 0,
              gridLineWidth: 0,
              opposite: true,
              title: {
                  text: null
              },
              labels: {
                  align: 'right',
                  x: -3,
                  y: 16,
                  format: '{value:.,0f}'
              },
              showFirstLabel: false
          }],
      
          plotOptions: {
              series: {
                  cursor: 'pointer',
                  point: {
                      events: {
                          click: function (e) {
                              hs.htmlExpand(null, {
                                  pageOrigin: {
                                      x: e.pageX || e.clientX,
                                      y: e.pageY || e.clientY
                                  },
                                  headingText: this.series.name,
                                  maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                                      this.y + ' sessions',
                                  width: 200
                              });
                          }
                      }
                  },
                  marker: {
                      lineWidth: 1
                  }
              }
          },
          legend: {
            enabled: false
          },
          credits: {
            enabled: false
          }    
      });
        this.isData = true;
      } else {
        this.foreCastData = {};
        this.isData = false;
        this.service.displayError = 'No Data Available';
      }
    });
  }

}
