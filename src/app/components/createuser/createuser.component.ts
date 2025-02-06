import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CommonModule } from '@angular/common'; // ✅ Importación para *ngIf y *ngFor
import { IonicModule } from '@ionic/angular'; // ✅ Importación para compatibilidad con Ionic

@Component({
  selector: 'app-createuser',
  standalone: true, // ✅ Componente Standalone
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonicModule], // ✅ Se agregaron los módulos necesarios
})
export class CreateUserComponent implements OnInit {
  registerForm!: FormGroup;
  registroExitoso: boolean = false;
  errorRegistro: boolean = false;
  showPassword: boolean = false;
  passwordWarnings = {
    visible: false,
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  };

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' }
  ];

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  async onRegister() {
    if (this.registerForm.valid) {
      try {
        // Guardar usuario en autenticador
        await this.firebaseService.registrarUsuario(
          this.registerForm.value.correo,
          this.registerForm.value.password
        );

        // Guardar usuario en Firestore sin la contraseña
        const userData = { ...this.registerForm.value };
        delete userData.password;
        await this.firebaseService.agregarUsuario(userData);

        this.registroExitoso = true;
        this.registerForm.reset();
      } catch (error) {
        console.error("Error en el registro:", error);
        this.errorRegistro = true;
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validarYFormatearRut() {
    let rut = this.registerForm.controls['rut'].value;
    if (this.validarRut(rut)) {
      this.registerForm.controls['rut'].setValue(this.formatearRut(rut));
    } else {
      this.registerForm.controls['rut'].setErrors({ invalid: true });
    }
  }

  validarRut(rut: string): boolean {
    rut = rut.replace(/\./g, '').replace('-', '');
    const cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString();

    return dv === dvCalculado;
  }

  formatearRut(rut: string): string {
    rut = rut.replace(/\./g, '').replace('-', '');
    const cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
  }

  checkPasswordStrength() {
    const password = this.registerForm.controls['password'].value;
    this.passwordWarnings.visible = true;
    this.passwordWarnings.minLength = password.length < 6;
    this.passwordWarnings.upperCase = !/[A-Z]/.test(password);
    this.passwordWarnings.lowerCase = !/[a-z]/.test(password);
    this.passwordWarnings.number = !/\d/.test(password);
    this.passwordWarnings.specialChar = !/[!@#$%^&*(),.?":{}|<>]/.test(password);
  }
}
