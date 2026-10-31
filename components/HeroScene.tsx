'use client';
import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';

/**
 * The hero photo as a living shot. One fragment shader draws:
 *  - traffic running along the light trails (direction taken from the photo's own edges)
 *  - windows switching on and off
 *  - a scan beam sweeping out from the camera
 *  - night haze, film grain and a slow cinematic push-in
 *  - the lens: magnified, recolored as thermal or night vision
 * Calls onReady(false) if WebGL is unavailable so the parent can fall back to plain images.
 */
const frag = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLens;
uniform float uR;
uniform float uMag;
uniform float uMode;
uniform float uMove;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float lum(vec3 c) { return dot(c, vec3(0.3, 0.45, 0.25)); }

const vec2 IMG = vec2(1376.0, 768.0);
const vec2 CAM = vec2(0.742, 0.315);

vec3 scene(vec2 uv) {
  float t = uTime * uMove;
  vec3 c = texture2D(uTex, uv).rgb;
  float L = lum(c);
  vec2 px = uv * IMG;

  // light trails: bright and blue
  float blue = clamp(c.b - c.r * 0.6, 0.0, 1.0);
  float trail = smoothstep(0.32, 0.62, L) * smoothstep(0.12, 0.3, blue);

  // direction of the trail from the photo's own gradient
  vec2 e = 3.0 / IMG;
  float gx = lum(texture2D(uTex, uv + vec2(e.x, 0.0)).rgb) - lum(texture2D(uTex, uv - vec2(e.x, 0.0)).rgb);
  float gy = lum(texture2D(uTex, uv + vec2(0.0, e.y)).rgb) - lum(texture2D(uTex, uv - vec2(0.0, e.y)).rgb);
  vec2 tang = normalize(vec2(-gy, gx) + 1e-4);
  float lane = hash(floor(px / 22.0));
  float phase = dot(px, tang) * 0.035 - t * (2.2 + lane * 1.8) + lane * 30.0;
  float cars = pow(max(0.0, sin(phase)), 6.0) * smoothstep(0.25, 0.6, noise(px * 0.02 + vec2(t * 0.2, 0.0)));
  c += trail * cars * vec3(0.6, 0.88, 1.0) * 1.1;
  c *= 1.0 - trail * 0.18 * (1.0 - cars);

  // windows: warm points that switch on and off
  vec2 cell = floor(px / vec2(5.0, 4.0));
  float h = hash(cell);
  float lit = step(0.5, fract(h * 7.0 + floor(t * 0.35 + h * 9.0) * 0.618));
  // only point lights: brighter than their surroundings
  vec2 o = 4.0 / IMG;
  float around = 0.25 * (lum(texture2D(uTex, uv + vec2(o.x, 0.0)).rgb) + lum(texture2D(uTex, uv - vec2(o.x, 0.0)).rgb)
                       + lum(texture2D(uTex, uv + vec2(0.0, o.y)).rgb) + lum(texture2D(uTex, uv - vec2(0.0, o.y)).rgb));
  float win = smoothstep(0.1, 0.22, L - around) * (1.0 - trail) * step(0.8, h);
  c = mix(c, c * mix(0.35, 1.25, lit), win * 0.8);

  // scan beam from the camera
  vec2 d = (uv - CAM) * vec2(IMG.x / IMG.y, 1.0);
  float ang = atan(d.y, d.x);
  float sweep = 2.55 + sin(t * 0.32) * 0.55;
  float da = abs(mod(ang - sweep + 3.14159, 6.28318) - 3.14159);
  float beam = smoothstep(0.16, 0.0, da) * smoothstep(0.02, 0.12, length(d)) * smoothstep(1.1, 0.2, length(d));
  c += beam * vec3(0.45, 0.75, 1.0) * 0.16 * (0.7 + 0.3 * noise(uv * 30.0 + t));

  // night haze drifting low over the city
  float fog = noise(uv * vec2(3.0, 6.0) + vec2(t * 0.03, 0.0)) * noise(uv * 7.0 - vec2(t * 0.05, 0.0));
  c += vec3(0.1, 0.18, 0.32) * fog * smoothstep(0.3, 1.0, uv.y) * 0.5;
  return c;
}

vec3 thermal(float g) {
  g = clamp(g * 1.5 - 0.12, 0.0, 1.0) * 5.0;
  vec3 s0 = vec3(0.06, 0.04, 0.18), s1 = vec3(0.22, 0.05, 0.42), s2 = vec3(0.55, 0.10, 0.55);
  vec3 s3 = vec3(0.89, 0.27, 0.43), s4 = vec3(1.0, 0.70, 0.20), s5 = vec3(1.0, 0.97, 0.78);
  if (g < 1.0) return mix(s0, s1, g);
  if (g < 2.0) return mix(s1, s2, g - 1.0);
  if (g < 3.0) return mix(s2, s3, g - 2.0);
  if (g < 4.0) return mix(s3, s4, g - 3.0);
  return mix(s4, s5, g - 4.0);
}
vec3 night(vec3 c, vec2 px) {
  float g = dot(c, vec3(0.35, 0.55, 0.6));
  vec3 n = vec3(g * 0.32, clamp(g * 1.7 - 0.05, 0.0, 1.0), g * 0.42);
  return n + vec3(0.0, 0.08, 0.0) * hash(px + uTime);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = vec2(frag.x / uRes.x, 1.0 - frag.y / uRes.y);

  // slow cinematic push-in
  float z = 1.0 + 0.018 * (0.5 + 0.5 * sin(uTime * uMove * 0.05));
  vec2 suv = (uv - 0.5) / z + 0.5 + vec2(sin(uTime * uMove * 0.031), cos(uTime * uMove * 0.027)) * 0.004;

  vec2 lp = vec2(uLens.x * uRes.x, (1.0 - uLens.y) * uRes.y);
  float dist = length(frag - lp);
  vec3 col;
  if (dist < uR) {
    vec2 luv = uLens + (uv - uLens) / uMag;
    vec3 s = scene(luv);
    col = uMode < 0.5 ? thermal(lum(s)) : night(s, frag);
    col *= 1.0 - smoothstep(uR * 0.7, uR, dist) * 0.35;
  } else {
    col = scene(suv) * 0.72;
  }
  col += (hash(frag + fract(uTime) * 100.0) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}`;

const vert = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

type Props = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  r: MotionValue<number>;
  mag: number;
  mode: 'thermal' | 'night';
  reduce: boolean;
  onReady: (ok: boolean) => void;
  className?: string;
};

export default function HeroScene({ sx, sy, r, mag, mode, reduce, onReady, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) { onReady(false); return; }

    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { onReady(false); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u('uRes'), uTime = u('uTime'), uLens = u('uLens'), uR = u('uR'), uMag = u('uMag'), uMode = u('uMode'), uMove = u('uMove');

    const resize = () => {
      const k = Math.min(window.devicePixelRatio || 1, 1.25) * (window.innerWidth < 768 ? 0.5 : 0.8);
      canvas.width = Math.max(1, Math.round(canvas.offsetWidth * k));
      canvas.height = Math.max(1, Math.round(canvas.offsetHeight * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let raf = 0;
    let visible = true;
    const start = performance.now();
    const draw = (now: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uLens, sx.get(), sy.get());
      gl.uniform1f(uR, r.get() * (canvas.width / canvas.offsetWidth));
      gl.uniform1f(uMag, mag);
      gl.uniform1f(uMode, modeRef.current === 'thermal' ? 0 : 1);
      gl.uniform1f(uMove, reduce ? 0 : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible) raf = requestAnimationFrame(draw);
    };

    const img = new Image();
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      resize();
      onReady(true);
      raf = requestAnimationFrame(draw);
    };
    img.onerror = () => onReady(false);
    img.src = 'img/hero-city.jpg';

    // stop drawing while the hero is off screen or the tab is hidden
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting && !document.hidden;
      if (visible && !was) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const onVis = () => {
      visible = !document.hidden && canvas.getBoundingClientRect().bottom > 0;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [sx, sy, r, mag, reduce, onReady]);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${className}`} />;
}
