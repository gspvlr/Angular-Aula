import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DadosFormulario {
  nome: string;
  email: string;
  area: string;
  mensagem: string;
  dataHora: string;
}

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule],
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  nome = '';
  email = '';
  area = '';
  mensagem = '';

  readonly areasDisponiveis: readonly string[] = [
    'Desenvolvimento Frontend (Angular / Web)',
    'Desenvolvimento Backend (Node / Java / C#)',
    'Full Stack Developer',
    'Mobile (Flutter / React Native)',
    'DevOps & Cloud Computing',
    'UI/UX Design',
    'Inteligência Artificial & Dados',
  ];

  readonly dadosCadastrados = signal<DadosFormulario | null>(null);

  cadastrar(): void {
    if (!this.isFormularioValido()) {
      alert('[AVISO] Por favor, preencha todos os campos antes de cadastrar!');
      return;
    }

    const novosDados = this.criarDadosFormulario();
    this.dadosCadastrados.set(novosDados);
    alert(this.formatarMensagemSucesso(novosDados));
  }

  limpar(): void {
    this.nome = '';
    this.email = '';
    this.area = '';
    this.mensagem = '';
    this.dadosCadastrados.set(null);
  }

  private isFormularioValido(): boolean {
    return Boolean(
      this.nome.trim() &&
      this.email.trim() &&
      this.area.trim() &&
      this.mensagem.trim()
    );
  }

  private criarDadosFormulario(): DadosFormulario {
    return {
      nome: this.nome.trim(),
      email: this.email.trim(),
      area: this.area,
      mensagem: this.mensagem.trim(),
      dataHora: new Date().toLocaleString('pt-BR'),
    };
  }

  private formatarMensagemSucesso(dados: DadosFormulario): string {
    return (
      '[SUCESSO] CADASTRO REALIZADO COM SUCESSO!\n\n' +
      'Valores cadastrados:\n' +
      `• Nome: ${dados.nome}\n` +
      `• E-mail: ${dados.email}\n` +
      `• Área Selecionada: ${dados.area}\n` +
      `• Mensagem (Escrita livre): ${dados.mensagem}\n\n` +
      `Registrado em: ${dados.dataHora}`
    );
  }
}
