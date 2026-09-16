import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme between light and dark', () => {
    const initial = service.isDarkMode();
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(!initial);
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(initial);
  });

  it('should set theme explicitly', () => {
    service.setTheme(true);
    expect(service.isDarkMode()).toBe(true);
    service.setTheme(false);
    expect(service.isDarkMode()).toBe(false);
  });
});
