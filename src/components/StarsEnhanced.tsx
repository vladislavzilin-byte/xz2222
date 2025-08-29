import * as React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type Props = { count?: number; radius?: number; intensity?: number; period?: number }

export default function StarsEnhanced({ count = 2000, radius = 140, intensity = 1.0, period = 22 }: Props) {
  const uniforms = React.useMemo(() => ({ uTime: { value: 0 }, uAlpha: { value: intensity }, uPeriod: { value: period } }), [intensity, period])

  const geo = React.useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const u = Math.random(), v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = radius * (0.7 + Math.random() * 0.3)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions[i*3+0]=x; positions[i*3+1]=y; positions[i*3+2]=z
      sizes[i] = 0.9 + Math.pow(Math.random(), 2.0) * 2.8
      phases[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return g
  }, [count, radius])

  useFrame((_, dt) => { uniforms.uTime.value += dt })

  const vertex = `
    uniform float uTime;
    attribute float aSize;
    attribute float aPhase;
    varying float vPhase;
    varying float vDist;
    void main(){
      vPhase = aPhase;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDist = length(mvPosition.xyz);
      float twinkle = 0.75 + 0.25 * sin(uTime * (2.0 + aPhase*3.0) + aPhase*6.28318);
      gl_PointSize = aSize * twinkle * 120.0 / vDist;
      gl_Position = projectionMatrix * mvPosition;
    }`
  const fragment = `
    precision highp float;
    uniform float uTime;
    uniform float uAlpha;
    uniform float uPeriod;
    varying float vPhase;
    float circleMask(vec2 uv){ float d = length(uv - 0.5) * 2.0; return smoothstep(1.0, 0.0, d); }
    void main(){
      float t = mod(uTime + vPhase * uPeriod, uPeriod);
      float fade = 1.0;
      float offStart = uPeriod * 0.70;
      if (t > offStart){ float k = (t - offStart) / (uPeriod * 0.30); fade = smoothstep(1.0, 0.0, clamp(k, 0.0, 1.0)); }
      vec2 uv = gl_PointCoord;
      float mask = circleMask(uv);
      float edge = pow(mask, 1.6);
      vec3 color = mix(vec3(0.80, 0.85, 1.0), vec3(1.0), 0.6);
      float alpha = edge * fade * uAlpha;
      if (alpha < 0.01) discard;
      gl_FragColor = vec4(color, alpha);
    }`

  return (
    <points>
      {/* @ts-ignore */}
      <shaderMaterial args={[{ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }]} />
      {/* @ts-ignore */}
      <primitive attach="geometry" object={geo} />
    </points>
  )
}
