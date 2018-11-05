import { Component, OnInit } from '@angular/core';
import { AppService } from './../app.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  name: FormControl;
  api: FormControl;
  cache: FormControl;
  public userObj: any;
  public updatMessage: string;

  constructor(public service: AppService) { }

  ngOnInit() {
    if (this.service.authenticateUser()) {
      this.userObj = JSON.parse(this.service.getFromBrowserStorage('userObj'));
    }
    this.name = new FormControl('', Validators.required);
    this.api = new FormControl('', Validators.required);
    this.cache = new FormControl('', Validators.required);
    this.createForm();
    this.updatMessage = undefined;
  }

  createForm() {
    this.profileForm = new FormGroup({
      name: this.name,
      api: this.api,
      cache: this.cache
    });
  }

  profileSubmit() {
    if (this.profileForm.valid) {
      console.log('Profile Form Submitted!');
      this.userObj.name = this.name.value;
      this.userObj.api = this.api.value;
      this.userObj.expiry = this.cache.value;
      this.service.setToBrowserStorage('userObj', JSON.stringify(this.userObj));
      this.service.changeIsUser(true);
      this.service.changeUserName(this.name.value);
      this.updatMessage = 'Successfully Updated Profile';
    }
  }

  clearCache(){
    console.log('Cache clear called');
    this.service.clearBrowserSessions();
  }

}
