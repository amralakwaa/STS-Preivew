'use client';
import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';

/**
 * The hero film (public/video/hero*.mp4, a 12 s seamless loop rendered from the city photo:
 * traffic on the light trails, windows switching, the camera's scan beam, haze, a slow push-in)
 * drawn through WebGL so the lens can read the moving picture: magnified and recolored as
 * thermal or night vision. Calls onReady(false) without WebGL so the parent shows the plain video.
 */
const frag = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLens;
uniform float uR;
uniform float uMag;
uniform float uMode;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float lum(vec3 c) { return dot(c, vec3(0.3, 0.45, 0.25)); }

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
  return vec3(g * 0.32, clamp(g * 1.7 - 0.05, 0.0, 1.0), g * 0.42) + vec3(0.0, 0.08, 0.0) * hash(px + uTime);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = vec2(frag.x / uRes.x, 1.0 - frag.y / uRes.y);
  vec2 lp = vec2(uLens.x * uRes.x, (1.0 - uLens.y) * uRes.y);
  float dist = length(frag - lp);
  vec3 col;
  if (dist < uR) {
    vec3 s = texture2D(uTex, uLens + (uv - uLens) / uMag).rgb;
    col = uMode < 0.5 ? thermal(lum(s)) : night(s, frag);
    col *= 1.0 - smoothstep(uR * 0.7, uR, dist) * 0.35;
  } else {
    col = texture2D(uTex, uv).rgb * 0.74;
  }
  col += (hash(frag + fract(uTime) * 100.0) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}`;

const vert = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

export const heroVideoSrc = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 'video/hero-mobile.mp4' : 'video/hero.mp4');

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
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
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
    const uRes = u('uRes'), uTime = u('uTime'), uLens = u('uLens'), uR = u('uR'), uMag = u('uMag'), uMode = u('uMode');

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const resize = () => {
      const k = Math.min(window.devicePixelRatio || 1, 1.5) * (window.innerWidth < 768 ? 0.7 : 0.9);
      canvas.width = Math.max(1, Math.round(canvas.offsetWidth * k));
      canvas.height = Math.max(1, Math.round(canvas.offsetHeight * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // the film plays in a hidden <video>; with reduced motion it stays on its first frame
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', '');
    video.src = heroVideoSrc();
    let hasFrame = false;

    let raf = 0;
    let visible = true;
    const start = performance.now();
    const draw = (now: number) => {
      if (video.readyState >= 2) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
        if (!hasFrame) { hasFrame = true; resize(); onReady(true); }
      }
      if (hasFrame) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.uniform2f(uLens, sx.get(), sy.get());
        gl.uniform1f(uR, r.get() * (canvas.width / canvas.offsetWidth));
        gl.uniform1f(uMag, mag);
        gl.uniform1f(uMode, modeRef.current === 'thermal' ? 0 : 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (visible) raf = requestAnimationFrame(draw);
    };

    const play = () => { if (!reduce) video.play().catch(() => {}); };
    video.addEventListener('loadeddata', play, { once: true });
    video.addEventListener('error', () => onReady(false), { once: true });
    video.load();
    raf = requestAnimationFrame(draw);

    // pause the film and the drawing while the hero is off screen or the tab is hidden
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting && !document.hidden;
      if (visible && !was) { play(); raf = requestAnimationFrame(draw); }
      if (!visible) video.pause();
    });
    io.observe(canvas);
    const onVis = () => {
      cancelAnimationFrame(raf);
      visible = !document.hidden && canvas.getBoundingClientRect().bottom > 0;
      if (visible) { play(); raf = requestAnimationFrame(draw); } else video.pause();
    };
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [sx, sy, r, mag, reduce, onReady]);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${className}`} />;
}
