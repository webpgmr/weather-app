import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppService } from './../app.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  apiForm: FormGroup;
  name: FormControl;
  api: FormControl;

  public userObj: any;

  constructor(
    private service: AppService,
    private router: Router) {
    this.userObj = {'name': '' , 'api': '', 'city': '', 'country': '', 'expiry': 0};
  }

  ngOnInit() {
    // sessionStorage.removeItem('userObj');
    // logged in User
    if ( this.service.getFromBrowserStorage('userObj') !== null ) {
      this.router.navigate(['/dashboard']);
      this.service.changeIsUser(true);
    }
    this.name = new FormControl('', Validators.required);
    this.api = new FormControl('', Validators.required);
    this.createForm();
  }

  createForm() {
    this.apiForm = new FormGroup({
      name: this.name,
      api: this.api
    });
  }

  continue() {
    if (this.apiForm.valid) {
      console.log('Form Submitted!');
      this.userObj.name = this.name.value;
      this.userObj.api = this.api.value;
      this.service.setToBrowserStorage('userObj', JSON.stringify(this.userObj));
      this.service.changeIsUser(true);
      this.service.changeUserName(this.name.value);
      this.router.navigate(['/dashboard']);
      this.apiForm.reset();
    }
  }

}
