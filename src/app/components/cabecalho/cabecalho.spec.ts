import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cabecalho } from './cabecalho';

describe('Cabecalho', () => {
  let component: Cabecalho;
  let fixture: ComponentFixture<Cabecalho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cabecalho],
    }).compileComponents();

    fixture = TestBed.createComponent(Cabecalho);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme when alternarTema is called', () => {
    const initialTheme = component.isDarkMode();
    component.alternarTema();
    expect(component.isDarkMode()).toBe(!initialTheme);
  });

  it('should toggle and close mobile menu', () => {
    expect(component.menuAberto()).toBe(false);
    component.alternarMenu();
    expect(component.menuAberto()).toBe(true);
    component.fecharMenu();
    expect(component.menuAberto()).toBe(false);
  });
});
