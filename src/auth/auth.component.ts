import { Component } from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'auth',
  standalone: true,
  imports: [],
  template: `
    <h1>Web Authentication Example</h1>
    <button (click)="register()">Register</button>
    <button (click)="login()" class="mx-2">Login</button>
  `,
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  constructor(private authService: AuthService) {}

  register() {
    this.authService.register();
  }

  login() {
    this.authService.login();
  }
}

