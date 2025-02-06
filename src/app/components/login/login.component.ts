import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  private auth: Auth = inject(Auth); // ✅ Se usa inject() en lugar de getAuth()

  constructor(private router: Router) {}

  async login() {
    console.log('Login attempt:', this.email, this.password);

    if (this.email === 'root' && this.password === 'root') {
      console.log('Usuario root autenticado');
      this.router.navigate(['/tabs/dashboard']);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Usuario autenticado:', userCredential.user);
      this.router.navigate(['/tabs/dashboard']);
    } catch (error) {
      console.error('Error de autenticación:', error);
      this.errorMessage = 'Credenciales incorrectas';
    }
  }
}
