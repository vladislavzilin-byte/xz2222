import * as React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type Props = {
  count?: number
  radius?: number
  intensity?: number
  sizeMin?: number
  sizeMax?: number
  giantChance?: number
  fastRatio?: number   // fraction of sky regions with 2x twinkle speed
}

export default function StarsEnhanced({
  count = 7000,
  radius = 200,
  intensity = 1.1,
  sizeMin = 0.6,
  sizeMax = 6.5,
  giantChance = 0.04,
  fastRatio = 0.5
}: Props) {
  const uniforms = React.useMemo(() => ({
    uTime:  { value: 0 },
    uAlpha: { value: intensity }
  }), [intensity])

  const geo = React.useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count) // seed per star
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count) // 1.0 or 2.0 twinkle speed regions

    const randPow = (p: number) => Math.pow(Math.random(), p)

    for (let i = 0; i < count; i++) {
      // Position on spherical shell
      const u = Math.random(), v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = radius * (0.85 + Math.random() * 0.2)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions[i*3+0] = x
      positions[i*3+1] = y
      positions[i*3+2] = z

      // Variable sizes (power-law-ish) + rare giants
      let t = randPow(2.6)
      let s = THREE.MathUtils.lerp(sizeMin, sizeMax, t)
      if (Math.random() < giantChance) s += 2.0 * Math.random() + 1.0
      sizes[i] = s

      // Seed for twinkle & chaotic fade
      phases[i] = Math.random()

      // Subtle color temperature variation
      const cool = new THREE.Color(0.78, 0.84, 1.0)
      const warm = new THREE.Color(1.0, 0.93, 0.82)
      const c = cool.clone().lerp(warm, Math.pow(Math.random(), 1.6))
      colors[i*3+0] = c.r
      colors[i*3+1] = c.g
      colors[i*3+2] = c.b

      // Region-based 2x twinkle
      const len = Math.sqrt(x*x + y*y + z*z) || 1.0
      const nx = x/len, ny = y/len, nz = z/len
      const gx = Math.floor((nx + 1.0) * 6.0)
      const gy = Math.floor((ny + 1.0) * 6.0)
      const gz = Math.floor((nz + 1.0) * 6.0)
      const regionSeed = gx + gy + gz
      let fast = (regionSeed % 2 === 0)
      if (Math.random() > fastRatio) fast = !fast
      speeds[i] = fast ? 2.0 : 1.0
    }

    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    g.setAttribute('aTwinkle', new THREE.BufferAttribute(speeds, 1))
    return g
  }, [count, radius, sizeMin, sizeMax, giantChance, fastRatio])

  useFrame((_, dt) => { uniforms.uTime.value += dt })

  const vertex = /* glsl */`
    uniform float uTime;
    attribute float aSize;
    attribute float aPhase;
    attribute float aTwinkle;
    attribute vec3  aColor;
    varying vec3 vColor;
    varying float vPhase;
    varying float vTw;
    varying float vDist;
    void main(){
      vColor = aColor;
      vPhase = aPhase;
      vTw    = aTwinkle;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vDist = length(mv.xyz);
      // 2x twinkle speed in fast regions
      float twinkle = 1.0 + 0.14 * sin(uTime * (1.6 * vTw + aPhase*2.2) + aPhase*6.28318);
      gl_PointSize = aSize * twinkle * 120.0 / vDist;
      gl_Position = projectionMatrix * mv;
    }
  `

  const fragment = /* glsl */`
    precision highp float;
    uniform float uTime;
    uniform float uAlpha;
    varying vec3  vColor;
    varying float vPhase;

    float circleMask(vec2 uv){
      float d = length(uv - 0.5) * 2.0;
      return smoothstep(1.0, 0.0, d);
    }
    // Simple hash
    float hash(float x){ return fract(sin(x) * 43758.5453123); }

    void main(){
      // Per-star chaotic full fade-out:
      // Derive a random period (6..14s), off duration (0.6..2.0s), and start offset from vPhase.
      float r1 = hash(vPhase * 123.45);
      float r2 = hash(vPhase * 987.65);
      float r3 = hash(vPhase * 456.78);
      float period = mix(6.0, 14.0, r1);
      float offDur = mix(0.6, 2.0, r2);
      float start  = mix(0.0, period - offDur, r3);
      float lt = mod(uTime, period);

      // Gate goes to 0 within [start, start+offDur], smooth 0.18s edges
      float edge = 0.18;
      float fadeOut = smoothstep(start, start + edge, lt);
      float fadeIn  = 1.0 - smoothstep(start + offDur - edge, start + offDur, lt);
      float gate = 1.0;
      if (lt >= start && lt <= start + offDur) {
        gate = min(fadeOut, fadeIn); // smooth down & up
      }

      vec2 uv = gl_PointCoord;
      float mask = circleMask(uv);
      float core = pow(mask, 2.0);
      float halo = pow(mask, 1.25) * 0.55;

      vec3 col = mix(vColor, vec3(1.0), 0.10) * (0.7 + 0.3 * core);
      float alpha = (core + halo) * gate * uAlpha;

      if (alpha < 0.01) discard;
      gl_FragColor = vec4(col, alpha);
    }
  `

  return (
    <points>
      {/* @ts-ignore */}
      <shaderMaterial args={[{ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }]} />
      {/* @ts-ignore */}
      <primitive attach="geometry" object={geo} />
    </points>
  )
}
