import { Component, OnInit } from '@angular/core';
import { AppService } from './../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isUserAvailable: boolean;
  public userName: string;
  public usrObj: any;

  constructor(
    private service: AppService,
    private router: Router ) {
    this.isUserAvailable = false;
  }

  ngOnInit() {
    this.service.isUser.subscribe(isUser => this.isUserAvailable = isUser);
    this.service.userName.subscribe(userName => this.userName = userName);
    this.usrObj = JSON.parse(this.service.getFromBrowserStorage('userObj'));
    if ( this.usrObj !== null ) {
      this.isUserAvailable = true;
    }
  }

  logout() {
    sessionStorage.removeItem('userObj');
    this.service.changeIsUser(false);
    this.service.changeUserName('');
    this.isUserAvailable = false;
    sessionStorage.clear()
    this.router.navigate(['/login']);
  }
}
