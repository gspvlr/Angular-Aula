import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Cadastro } from './components/cadastro/cadastro';
import { PixelSnow } from './components/pixel-snow/pixel-snow';
import { Rodape } from './components/rodape/rodape';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho, Cadastro, Rodape, PixelSnow],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly title = 'Café & Código';
  readonly themeService = inject(ThemeService);
}
