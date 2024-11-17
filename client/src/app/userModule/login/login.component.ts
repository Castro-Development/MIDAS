import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { interval, tap } from 'rxjs';
import { AuthStateService } from '../../shared/user/auth/auth-state.service';
import { UserSecurityFacade } from '../../shared/user/auth/user-security.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authState = inject(AuthStateService);
  formValue !: FormGroup;
  userData !: any;
  passwordHide: boolean = true;

  constructor(private formbuilder: FormBuilder, private router: Router, private http: HttpClient, private securityFacade: UserSecurityFacade){
    this.formValue = this.formbuilder.group({
      username:[''],
      password:[''],
    })
  }

  login() {
    console.log(this.formValue.value.username); console.log(this.formValue.value.password);
    this.securityFacade.login(this.formValue.value.username, this.formValue.value.password);
    // interval(1000).subscribe(() => {
    //   if (this.authState.isLoggedIn$) {
    //     this.router.navigate(['']);
    //   }
    // });
  }


  // ngOnInit(): void {
  //   this.formValue = this.formbuilder.group({
  //     username:[''],
  //     password:[''],

  //   })

  // }
}