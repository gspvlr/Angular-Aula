import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme';

@Component({
  imports: [],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.css',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  private readonly themeService = inject(ThemeService);
  public readonly menuAberto = signal<boolean>(false);

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  alternarTema(): void {
    this.themeService.toggleTheme();
  }

  alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }
}
