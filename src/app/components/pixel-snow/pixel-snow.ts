import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform float uFlakeSize;
uniform float uMinFlakeSize;
uniform float uSpeed;
uniform float uDensity;
uniform float uDirection;
uniform float uBrightness;
uniform float uDepthFade;
uniform float uFarPlane;
uniform int uVariant;

varying vec2 vUv;

#define M1 1597334677U
#define M2 3812015801U
#define M3 3299493293U
#define F0 (1.0 / 4294967295.0)

uint hash(uint n) {
  return n * (n ^ (n >> 15U));
}

uint coord3(ivec3 p) {
  return (uvec3(p).x * M1) ^ (uvec3(p).y * M2) ^ (uvec3(p).z * M3);
}

float hash1(ivec3 p) {
  return float(hash(coord3(p))) * F0;
}

vec3 hash3(ivec3 p) {
  uint h = coord3(p);
  uint h1 = hash(h);
  uint h2 = hash(h1 + 198491317U);
  uint h3 = hash(h2 + 6542989U);
  return vec3(float(h1) * F0, float(h2) * F0, float(h3) * F0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

  float rad = radians(uDirection);
  vec2 windDir = vec2(cos(rad), -sin(rad));

  float totalSnow = 0.0;
  const int LAYERS = 8;

  for (int i = 1; i <= LAYERS; i++) {
    float layerProgress = float(i) / float(LAYERS);
    float layerSpeed = uSpeed * (1.1 / sqrt(float(i)));
    vec2 posOffset = windDir * layerSpeed * uTime * 0.4;
    float layerScale = 3.5 + float(i) * 0.7;
    vec2 layerUv = uv * layerScale - posOffset;
    layerUv.x += sin(uTime * 1.2 + float(i) * 1.5) * 0.03 * layerProgress;

    ivec2 cell = ivec2(floor(layerUv));
    vec2 local = fract(layerUv) - 0.5;

    for (int ox = -1; ox <= 1; ox++) {
      for (int oy = -1; oy <= 1; oy++) {
        ivec2 curCell = cell + ivec2(ox, oy);
        ivec3 cellKey = ivec3(curCell, i * 23);

        float h = hash1(cellKey);
        if (h < uDensity * 0.6) {
          vec3 rnd = hash3(cellKey);
          vec2 flakeCenter = vec2(float(ox), float(oy)) + (rnd.xy - 0.5) * 0.7;
          vec2 d = local - flakeCenter;

          float rawSize = uFlakeSize * (rnd.z * 0.4 + 0.8) * (14.0 / layerScale);
          float minSize = uMinFlakeSize * 0.008;
          float flakeSize = max(rawSize, minSize);

          bool inside = false;
          if (uVariant == 0) {
            inside = max(abs(d.x), abs(d.y)) < flakeSize;
          } else if (uVariant == 1) {
            inside = length(d) < flakeSize;
          } else {
            float cross = min(
              max(abs(d.x) - flakeSize * 0.35, abs(d.y) - flakeSize),
              max(abs(d.y) - flakeSize * 0.35, abs(d.x) - flakeSize)
            );
            inside = (cross < 0.0) || (length(d) < flakeSize * 0.6);
          }

          if (inside) {
            float depthFade = exp(-layerProgress * uDepthFade * 0.4);
            float flakeAlpha = depthFade * (rnd.z * 0.35 + 0.65);
            totalSnow = max(totalSnow, flakeAlpha);
          }
        }
      }
    }
  }

  float finalAlpha = clamp(totalSnow, 0.0, 1.0);
  gl_FragColor = vec4(uColor * uBrightness, finalAlpha);
}
`;

@Component({
  selector: 'app-pixel-snow',
  imports: [],
  templateUrl: './pixel-snow.html',
  styleUrl: './pixel-snow.css',
})
export class PixelSnow implements AfterViewInit, OnChanges, OnDestroy {
  @Input() color = '#ffffff';
  @Input() flakeSize = 0.01;
  @Input() minFlakeSize = 1.25;
  @Input() pixelResolution = 200;
  @Input() speed = 1.25;
  @Input() density = 0.3;
  @Input() direction = 125;
  @Input() brightness = 1;
  @Input() depthFade = 8;
  @Input() farPlane = 200;
  @Input() variant: 'square' | 'round' | 'snowflake' = 'snowflake';

  @ViewChild('canvas') private canvasRef?: ElementRef<HTMLCanvasElement>;

  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.OrthographicCamera;
  private material?: THREE.ShaderMaterial;
  private geometry?: THREE.PlaneGeometry;
  private clock?: THREE.Clock;
  private uniforms?: Record<string, THREE.IUniform>;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.initThree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.uniforms) {
      return;
    }

    if (changes['color']) {
      this.atualizarCor();
    }
    if (changes['flakeSize']) {
      this.uniforms['uFlakeSize'].value = this.flakeSize;
    }
    if (changes['minFlakeSize']) {
      this.uniforms['uMinFlakeSize'].value = this.minFlakeSize;
    }
    if (changes['pixelResolution']) {
      this.uniforms['uPixelResolution'].value = this.pixelResolution;
    }
    if (changes['speed']) {
      this.uniforms['uSpeed'].value = this.speed;
    }
    if (changes['density']) {
      this.uniforms['uDensity'].value = this.density;
    }
    if (changes['direction']) {
      this.uniforms['uDirection'].value = this.direction;
    }
    if (changes['brightness']) {
      this.uniforms['uBrightness'].value = this.brightness;
    }
    if (changes['depthFade']) {
      this.uniforms['uDepthFade'].value = this.depthFade;
    }
    if (changes['farPlane']) {
      this.uniforms['uFarPlane'].value = this.farPlane;
    }
    if (changes['variant']) {
      this.uniforms['uVariant'].value = this.getVariantIndex();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.geometry) {
      this.geometry.dispose();
    }
    if (this.material) {
      this.material.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree(): void {
    if (!this.canvasRef?.nativeElement) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement || this.elementRef.nativeElement;
    const width = parent.clientWidth || window.innerWidth || 300;
    const height = parent.clientHeight || window.innerHeight || 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
      this.renderer.setPixelRatio(1);
      this.renderer.setClearColor(0x000000, 0);
    } catch {
      return;
    }

    const targetRes = Math.max(50, this.pixelResolution);
    const pixelScale = Math.max(1, Math.floor(height / targetRes));
    const renderWidth = Math.max(1, Math.ceil(width / pixelScale));
    const renderHeight = Math.max(1, Math.ceil(height / pixelScale));
    this.renderer.setSize(renderWidth, renderHeight, false);

    this.uniforms = {
      uResolution: { value: new THREE.Vector2(renderWidth, renderHeight) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(this.color) },
      uFlakeSize: { value: this.flakeSize },
      uMinFlakeSize: { value: this.minFlakeSize },
      uSpeed: { value: this.speed },
      uDensity: { value: this.density },
      uDirection: { value: this.direction },
      uBrightness: { value: this.brightness },
      uDepthFade: { value: this.depthFade },
      uFarPlane: { value: this.farPlane },
      uVariant: { value: this.getVariantIndex() },
    };

    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(mesh);

    this.clock = new THREE.Clock();

    this.startAnimation();
    this.setupResizeObserver();
  }

  private startAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);

        if (this.isDocumentoOculto()) {
          return;
        }

        if (this.material && this.clock && this.uniforms) {
          this.uniforms['uTime'].value = this.clock.getElapsedTime();
        }

        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };
      animate();
    });
  }

  private isDocumentoOculto(): boolean {
    return typeof document !== 'undefined' && document.hidden;
  }

  private atualizarCor(): void {
    if (!this.uniforms) {
      return;
    }
    try {
      this.uniforms['uColor'].value.set(this.color);
    } catch {
      return;
    }
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const hostOrParent = this.elementRef.nativeElement.parentElement || this.elementRef.nativeElement;
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width || hostOrParent.clientWidth;
        const height = entry.contentRect.height || hostOrParent.clientHeight;
        if (width > 0 && height > 0) {
          this.handleResize(width, height);
        }
      }
    });

    this.resizeObserver.observe(hostOrParent);
  }

  private handleResize(width: number, height: number): void {
    if (this.renderer && this.uniforms) {
      const targetRes = Math.max(50, this.pixelResolution);
      const pixelScale = Math.max(1, Math.floor(height / targetRes));
      const renderWidth = Math.max(1, Math.ceil(width / pixelScale));
      const renderHeight = Math.max(1, Math.ceil(height / pixelScale));

      this.renderer.setSize(renderWidth, renderHeight, false);
      (this.uniforms['uResolution'].value as THREE.Vector2).set(renderWidth, renderHeight);
    }
  }

  private getVariantIndex(): number {
    switch (this.variant) {
      case 'square':
        return 0;
      case 'round':
        return 1;
      case 'snowflake':
      default:
        return 2;
    }
  }
}
