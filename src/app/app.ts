import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Cadastro } from './components/cadastro/cadastro';
import { Rodape } from './components/rodape/rodape';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho, Cadastro, Rodape],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title = 'nome-do-projeto';
}
