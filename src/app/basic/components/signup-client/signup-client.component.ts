import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup-client',
  templateUrl: './signup-client.component.html',
  styleUrls: ['./signup-client.component.scss']
})
export class SignupClientComponent {

  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      phone: [null],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required]],
    }, { validators: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const checkPassword = group.get('checkPassword')?.value;
    return password === checkPassword ? null : { notSame: true };
  }

  submitForm(): void {
    if (this.validateForm.invalid) {
      this.notification.error(
        'Error',
        'Please fill out all required fields correctly',
        { nzDuration: 5000 }
      );
      return;
    }

    this.authService.registerClient(this.validateForm.value).subscribe(
      res => {
        this.notification.success(
          'Success',
          'Account created successfully',
          { nzDuration: 5000 }
        );
        this.router.navigateByUrl('/login');
      },
      error => {
        this.notification.error(
          'Error',
          'An error occurred while creating the account',
          { nzDuration: 5000 }
        );
      }
    );
  }
}
