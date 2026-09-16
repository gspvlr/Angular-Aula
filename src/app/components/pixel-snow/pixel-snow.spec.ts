import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PixelSnow } from './pixel-snow';

describe('PixelSnow', () => {
  let component: PixelSnow;
  let fixture: ComponentFixture<PixelSnow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixelSnow],
    }).compileComponents();

    fixture = TestBed.createComponent(PixelSnow);
    component = fixture.componentInstance;
  });

  it('should create the PixelSnow component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct default input values as specified in the usage example', () => {
    expect(component.color).toBe('#ffffff');
    expect(component.flakeSize).toBe(0.01);
    expect(component.minFlakeSize).toBe(1.25);
    expect(component.pixelResolution).toBe(200);
    expect(component.speed).toBe(1.25);
    expect(component.density).toBe(0.3);
    expect(component.direction).toBe(125);
    expect(component.brightness).toBe(1);
    expect(component.variant).toBe('snowflake');
    expect(component.depthFade).toBe(8);
    expect(component.farPlane).toBe(200);
  });

  it('should allow setting custom input values', () => {
    component.color = '#00ffcc';
    component.flakeSize = 0.02;
    component.minFlakeSize = 2.0;
    component.pixelResolution = 150;
    component.speed = 2.0;
    component.density = 0.5;
    component.direction = 90;
    component.brightness = 1.5;
    component.variant = 'round';

    expect(component.color).toBe('#00ffcc');
    expect(component.flakeSize).toBe(0.02);
    expect(component.minFlakeSize).toBe(2.0);
    expect(component.pixelResolution).toBe(150);
    expect(component.speed).toBe(2.0);
    expect(component.density).toBe(0.5);
    expect(component.direction).toBe(90);
    expect(component.brightness).toBe(1.5);
    expect(component.variant).toBe('round');
  });
});
