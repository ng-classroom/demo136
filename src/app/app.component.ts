import { Component } from '@angular/core';
import { WasmService } from 'src/app/wasm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'demo136';
  constructor(
    protected wasm: WasmService
  ) {
    this.wasm.factorial(7).subscribe(
      (respuesta) => {
        this.title = respuesta;
      }
    );
  }
}
