import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateUserComponent implements OnInit {
  registerForm: FormGroup;
  usuarios: any[] = [];
  registroExitoso: boolean = false;
  errorRegistro: boolean = false;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.firebaseService.obtenerUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.firebaseService.guardarUsuario(this.registerForm.value)
        .then(() => {
          console.log('Usuario registrado en Firebase');
          this.registroExitoso = true;
          this.errorRegistro = false;
        })
        .catch(error => {
          console.error('Error al registrar usuario', error);
          this.errorRegistro = true;
          this.registroExitoso = false;
        });
    }
  }
}
