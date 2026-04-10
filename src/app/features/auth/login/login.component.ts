import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ Hardcoded users — jab backend aaye tab sirf loginUser() method replace karna
const MOCK_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'manager', password: 'manager123', role: 'manager' },
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  constructor(private router: Router) {
    // Agar pehle se logged in hai toh dashboard pe bhej do
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please enter both username and password.';
      return;
    }

    this.loading = true;
    this.error = '';

    // ✅ Fake async delay (real API feel dene ke liye)
    // Jab backend aaye: yeh block hata do aur ApiService.login() call karo
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) =>
          u.username === this.username.trim() && u.password === this.password
      );

      if (user) {
        // Token save karo — jab backend aaye tab real JWT aayega
        localStorage.setItem('token', 'mock-token-' + user.role);
        localStorage.setItem(
          'user',
          JSON.stringify({ username: user.username, role: user.role })
        );
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Invalid username or password.';
        this.loading = false;
      }
    }, 800);
  }
}
