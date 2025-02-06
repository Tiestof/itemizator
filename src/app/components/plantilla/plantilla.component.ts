import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.scss']
})
export class PlantillaComponent implements OnInit {
  plantilla: any = {};
  plantillaString: string = '';
  plantillas: any[] = [];
  guardadoExitoso: boolean = false;
  errorAlGuardar: boolean = false;

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
      });
  }
}
