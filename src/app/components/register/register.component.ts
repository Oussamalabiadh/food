import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private _AuthService: AuthService) {}

  ngOnInit(): void {}

  msgError!: String;
  isRegister: boolean = false;

  // register form
  register: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/
),
    ]),
    rePassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/
),
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.min(11),
      Validators.pattern(/^010\d{8}$/),
    ]),
    });

  // to send register to api
  submitRegister(register: FormGroup): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3200,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    // if data is valid
    if (register.valid) {
      this.isRegister = true;
      this._AuthService.registerForm(register.value).subscribe({
        next: (response) => {
          if (response.message === 'success') {
            register.reset();
            Toast.fire({
              icon: 'success',
              title: `${response.message}`,
            });
          } else {
            Toast.fire({
              icon: 'error',
              title: `${response.errors.email.message}`,
            });
          }
        },
        complete: () => {
          this.isRegister = false;
        },
      });
    } else {
      Toast.fire({
        icon: 'error',
        title: `Data Required`,
      });
    }
  }
}
