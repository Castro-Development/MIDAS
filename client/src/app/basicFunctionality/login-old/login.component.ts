import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { UserService } from '../../services/UserService/user.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  userService = inject(UserService);
  formValue !: FormGroup;
  userData !: any;
  passwordHide: boolean = true;

  constructor(private formbuilder: FormBuilder, private router: Router, private http: HttpClient, private auth: Auth){}

  login() {
        this.userService.login(this.formValue.value.username, this.formValue.value.password);
        this.router.navigate(['']);
  }


  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      username:[''],
      password:[''],

    })

  }
}
