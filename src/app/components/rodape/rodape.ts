import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-rodape',
  styleUrl: './rodape.css',
  templateUrl: './rodape.html',
})
export class Rodape {
  voltarAoTopo(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
