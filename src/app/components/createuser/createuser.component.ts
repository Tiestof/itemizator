import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ✅ Importamos ReactiveFormsModule
import { FirebaseService } from 'src/app/services/firebase.service';
import { CommonModule } from '@angular/common'; // ✅ Importamos CommonModule

@Component({
  selector: 'app-createuser',
  standalone: true, // ✅ Componente Standalone
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss'],
  imports: [CommonModule, ReactiveFormsModule], // ✅ Agregamos ReactiveFormsModule
})
export class CreateUserComponent implements OnInit {
  registerForm!: FormGroup;
  usuarios: any[] = [];
  registroExitoso: boolean = false;
  errorRegistro: boolean = false;
  showPassword: boolean = false;
  passwordErrors = {
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  };

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' }
  ]; // ✅ Definir roles

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', [Validators.required, this.validarRUT]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  async onRegister() {
    if (this.registerForm.valid) {
      try {
        await this.firebaseService.registrarUsuario(
          this.registerForm.value.correo,
          this.registerForm.value.password
        );
        this.registroExitoso = true;
        this.registerForm.reset();
      } catch (error) {
        console.error("Error en registro:", error);
        this.errorRegistro = true;
      }
    }
  }

  formatRut(event: any) {
    let rut = event.target.value.replace(/\D/g, '');
    this.registerForm.controls['rut'].setValue(rut);
  }

  autocompleteEmail() {
    const nombre = this.registerForm.controls['nombre'].value;
    if (nombre) {
      this.registerForm.controls['correo'].setValue(nombre.toLowerCase() + '@maxisinformatica.com');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength() {
    const password = this.registerForm.controls['password'].value;
    
    this.passwordErrors = {
      minLength: password.length < 6,
      upperCase: !/[A-Z]/.test(password),
      lowerCase: !/[a-z]/.test(password),
      number: !/\d/.test(password),
      specialChar: !/[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }

  validarRUT(control: any) {
    const rut = control.value;
    return null;
  }
}
