import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {}

  /**
   * Guarda una plantilla en Firestore
   * @param data Datos de la plantilla a guardar
   * @returns Promesa con el resultado de la operación
   */
  guardarPlantilla(data: any): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID único
    return this.firestore.collection('plantillas').doc(id).set(data);
  }

  /**
   * Obtiene todas las plantillas almacenadas en Firestore
   * @returns Observable con los datos
   */
  obtenerPlantillas(): Observable<any[]> {
    return this.firestore.collection('plantillas').valueChanges();
  }

  /**
   * Guarda un usuario en Firestore
   * @param usuario Datos del usuario a registrar
   * @returns Promesa con el resultado de la operación
   */
  guardarUsuario(usuario: any): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID único
    return this.firestore.collection('usuarios').doc(id).set(usuario);
  }

  /**
   * Obtiene todos los usuarios registrados en Firestore
   * @returns Observable con los usuarios
   */
  obtenerUsuarios(): Observable<any[]> {
    return this.firestore.collection('usuarios').valueChanges();
  }
}
