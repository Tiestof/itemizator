import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CommonModule } from '@angular/common'; // ✅ Importamos CommonModule para *ngIf, *ngFor y json pipe
import { FormsModule } from '@angular/forms'; // ✅ Necesario para manejar formularios

@Component({
  selector: 'app-plantilla',
  standalone: true, // ✅ Componente Standalone
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.scss'],
  imports: [CommonModule, FormsModule], // ✅ Agregamos CommonModule para que funcione *ngIf, *ngFor y json pipe
})
export class PlantillaComponent implements OnInit {
  plantilla: any = {};
  plantillaString: string = '';
  plantillas: any[] = [];
  guardadoExitoso: boolean = false;
  errorAlGuardar: boolean = false;
  cargando: boolean = false; // ✅ Indicador de carga

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.obtenerPlantillas().subscribe((data) => {
      this.plantillas = data;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          this.plantilla = JSON.parse(reader.result as string);
          this.plantillaString = JSON.stringify(this.plantilla, null, 2);
        } catch (e) {
          console.error('Error al parsear el JSON', e);
        }
      };
      reader.readAsText(file);
    }
  }

  guardarEnFirebase(): void {
    if (Object.keys(this.plantilla).length === 0) {
      console.error('No hay datos para guardar');
      return;
    }

    this.cargando = true; // ✅ Mostrar indicador de carga
    this.firebaseService.guardarPlantilla(this.plantilla)
      .then(() => {
        console.log('Plantilla guardada en Firebase');
        this.guardadoExitoso = true;
        this.errorAlGuardar = false;
      })
      .catch(error => {
        console.error('Error guardando en Firebase', error);
        this.errorAlGuardar = true;
        this.guardadoExitoso = false;
      })
      .finally(() => {
        this.cargando = false; // ✅ Ocultar indicador de carga
      });
  }
}
