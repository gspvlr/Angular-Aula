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

  areasDisponiveis = [
    'Desenvolvimento Frontend (Angular / Web)',
    'Desenvolvimento Backend (Node / Java / C#)',
    'Full Stack Developer',
    'Mobile (Flutter / React Native)',
    'DevOps & Cloud Computing',
    'UI/UX Design',
    'Inteligência Artificial & Dados',
  ];

  // Armazena os dados do último cadastro para exibição imediata na tela
  dadosCadastrados = signal<DadosFormulario | null>(null);

  cadastrar(): void {
    if (!this.nome.trim() || !this.email.trim() || !this.area || !this.mensagem.trim()) {
      alert('⚠️ Atenção: Por favor, preencha todos os campos antes de cadastrar!');
      return;
    }

    const novosDados: DadosFormulario = {
      nome: this.nome.trim(),
      email: this.email.trim(),
      area: this.area,
      mensagem: this.mensagem.trim(),
      dataHora: new Date().toLocaleString('pt-BR'),
    };

    this.dadosCadastrados.set(novosDados);

    const mensagemAviso =
      '🎉 CADASTRO REALIZADO COM SUCESSO!\n\n' +
      'Valores cadastrados:\n' +
      `• Nome: ${novosDados.nome}\n` +
      `• E-mail: ${novosDados.email}\n` +
      `• Área Selecionada: ${novosDados.area}\n` +
      `• Mensagem (Escrita livre): ${novosDados.mensagem}\n\n` +
      `Registrado em: ${novosDados.dataHora}`;

    alert(mensagemAviso);
  }

  limpar(): void {
    this.nome = '';
    this.email = '';
    this.area = '';
    this.mensagem = '';
    this.dadosCadastrados.set(null);
  }
}
