'use client';
import { useEffect, useRef } from 'react';

/**
 * Living backdrop for the whole page: domain-warped smoke in the brand's night
 * blues, thin veins of heat, and embers drifting upward. The smoke twists around
 * the pointer and slides with scroll. Rendered at reduced resolution; paused when
 * the tab is hidden; a single still frame under prefers-reduced-motion.
 */
const frag = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.045;
  p.y -= uScroll * 0.00035;

  // the smoke twists around the pointer
  vec2 d = p - m;
  float pull = exp(-dot(d, d) * 7.0);
  float a = pull * 1.6;
  p = m + mat2(cos(a), -sin(a), sin(a), cos(a)) * d;

  vec2 q = vec2(fbm(p * 1.4 + vec2(0.0, t)), fbm(p * 1.4 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.4 + 3.8 * q + vec2(1.7, 9.2) + t * 1.6), fbm(p * 1.4 + 3.8 * q + vec2(8.3, 2.8) - t * 1.3));
  float f = fbm(p * 1.4 + 3.6 * r);

  vec3 ink = vec3(0.035, 0.067, 0.122);
  vec3 lapis = vec3(0.075, 0.15, 0.27);
  vec3 tide = vec3(0.12, 0.27, 0.48);
  vec3 amber = vec3(1.0, 0.68, 0.22);
  vec3 rose = vec3(0.89, 0.25, 0.42);

  vec3 col = mix(ink, lapis, clamp(f * f * 2.2, 0.0, 1.0));
  col = mix(col, tide, clamp(dot(q, q) * 0.55, 0.0, 1.0) * smoothstep(0.35, 0.9, f));

  // veins of heat along the folds of the smoke
  float fold = abs(r.x - r.y);
  float vein = smoothstep(0.035, 0.0, fold) * smoothstep(0.45, 0.8, f);
  col += mix(rose, amber, clamp(f * 1.4 - 0.2, 0.0, 1.0)) * vein * 0.55;
  col += amber * pull * 0.06;

  // embers rising
  vec2 g = (gl_FragCoord.xy / uRes.y) * vec2(16.0, 9.0) + vec2(0.0, -uTime * 0.55 + uScroll * 0.004);
  vec2 id = floor(g);
  vec2 fr = fract(g) - 0.5;
  float h = hash(id);
  vec2 off = vec2(hash(id + 3.1) - 0.5, hash(id + 7.7) - 0.5) * 0.7 + vec2(sin(uTime * 0.8 + h * 30.0) * 0.12, 0.0);
  float ember = step(0.955, h) * smoothstep(0.07, 0.0, length(fr - off)) * (0.55 + 0.45 * sin(uTime * 2.6 + h * 60.0));
  col += mix(amber, rose, hash(id + 1.9)) * ember * 1.1;

  // vignette keeps text areas calm
  vec2 v = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - dot(v, v) * 0.9;
  gl_FragColor = vec4(col, 1.0);
}`;

const vert = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

export default function Ether() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cleanup = () => {};
    // wait until the page has shown itself; the backdrop is never what the visitor came for
    const start = () => { cleanup = boot() ?? (() => {}); };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const t = window.setTimeout(() => (w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 2500 }) : start()), 900);
    return () => { window.clearTimeout(t); cleanup(); };
  }, []);

  const boot = () => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    // phones and tablets get one still frame of the smoke: same look, no running GPU work
    const lite = window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uScroll = gl.getUniformLocation(prog, 'uScroll');

    const reduce = lite || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scale = Math.min(window.devicePixelRatio || 1, 2) * (window.innerWidth < 768 ? 0.4 : 0.5);
    let w = 0, h = 0;
    const resize = () => {
      w = Math.max(1, Math.round(window.innerWidth * scale));
      h = Math.max(1, Math.round(window.innerHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();

    let mx = w * 0.7, my = h * 0.6, tx = mx, ty = my;
    const onMove = (e: PointerEvent) => { tx = e.clientX * scale; ty = h - e.clientY * scale; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', resize);

    let raf = 0;
    const start = performance.now();
    let last = 0;
    const draw = (now: number) => {
      // the smoke moves slowly: 30 frames a second is plenty and halves the GPU cost
      if (!reduce && now - last < 32) { raf = requestAnimationFrame(draw); return; }
      last = now;
      mx += (tx - mx) * 0.1;
      my += (ty - my) * 0.1;
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, reduce ? 20 : (now - start) / 1000 + 20);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uScroll, window.scrollY * scale);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', onVis);
    const redraw = () => requestAnimationFrame(draw);
    if (reduce && !lite) window.addEventListener('scroll', redraw, { passive: true });
    if (lite) window.addEventListener('resize', redraw);
    canvas.style.opacity = '1';

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', redraw);
      window.removeEventListener('scroll', redraw);
      document.removeEventListener('visibilitychange', onVis);
    };
  };

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full transition-opacity duration-1000" style={{ background: '#0C1626', opacity: 0 }} />;
}
