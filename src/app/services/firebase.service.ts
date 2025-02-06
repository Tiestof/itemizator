import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc, collectionData, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async registrarUsuario(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async agregarUsuario(data: any) {
    const usersCollection = collection(this.firestore, 'usuarios');

    // Verifica si el usuario ya existe con el mismo RUT
    const q = query(usersCollection, where("rut", "==", data.rut));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("El usuario con este RUT ya existe.");
    }

    return addDoc(usersCollection, data);
  }

  obtenerUsuarios(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'usuarios');
    return collectionData(usersCollection, { idField: 'id' }) as Observable<any[]>;
  }

  obtenerPlantillas(): Observable<any[]> {
    const plantillasCollection = collection(this.firestore, 'plantillas');
    return collectionData(plantillasCollection, { idField: 'id' }) as Observable<any[]>;
  }

  async guardarPlantilla(data: any) {
    const plantillasCollection = collection(this.firestore, 'plantillas');
    return addDoc(plantillasCollection, data);
  }
}
