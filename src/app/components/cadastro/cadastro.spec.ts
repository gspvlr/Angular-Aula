import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cadastro } from './cadastro';

describe('Cadastro', () => {
  let component: Cadastro;
  let fixture: ComponentFixture<Cadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cadastro],
    }).compileComponents();

    fixture = TestBed.createComponent(Cadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not register if fields are empty and should alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    component.cadastrar();
    expect(alertSpy).toHaveBeenCalled();
    expect(component.dadosCadastrados()).toBeNull();
  });

  it('should register and return entered values when all 4 fields are filled', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    component.nome = 'Grace Hopper';
    component.email = 'grace@hopper.dev';
    component.area = 'Desenvolvimento Backend (Node / Java / C#)';
    component.mensagem = 'Pioneira da computação e criadora do primeiro compilador.';

    component.cadastrar();

    expect(alertSpy).toHaveBeenCalled();
    const dados = component.dadosCadastrados();
    expect(dados).not.toBeNull();
    expect(dados?.nome).toBe('Grace Hopper');
    expect(dados?.email).toBe('grace@hopper.dev');
    expect(dados?.area).toBe('Desenvolvimento Backend (Node / Java / C#)');
    expect(dados?.mensagem).toBe('Pioneira da computação e criadora do primeiro compilador.');
  });
});
