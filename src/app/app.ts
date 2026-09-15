import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title = 'nome-do-projeto';
}
