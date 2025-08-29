import * as React from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'

type Props = { url: string }
export default function HeroModel({ url }: Props) {
  const tex = useLoader(THREE.TextureLoader, url)
  tex.flipY = false
  const mesh = React.useRef<THREE.Mesh>(null!)
  const uniforms = React.useMemo(()=>({ uMap:{ value: tex }, uDisplace:{ value: 0.28 }, uOpacity:{ value: 1.0 }, uTime:{ value: 0.0 } }),[tex])
  useFrame((state, dt)=>{
    uniforms.uTime.value += dt
    const t = state.clock.getElapsedTime()
    const breathe = Math.sin(t*1.2)*0.02
    uniforms.uDisplace.value = 0.26 + breathe
    const px = state.pointer.x*0.15
    const py = state.pointer.y*0.1
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, px, 0.05)
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -py, 0.05)
  })
  const vs = `
    varying vec2 vUv;
    uniform sampler2D uMap;
    uniform float uDisplace;
    uniform float uTime;
    void main(){
      vUv = uv;
      vec4 c = texture2D(uMap, uv);
      float h = dot(c.rgb, vec3(0.299,0.587,0.114));
      float wave = sin((uv.y + uTime*0.2)*10.0)*0.01;
      vec3 transformed = position + normal * ((h-0.5)*uDisplace + wave);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed,1.0);
    }`
  const fs = `
    varying vec2 vUv;
    uniform sampler2D uMap;
    uniform float uOpacity;
    void main(){
      vec4 c = texture2D(uMap, vUv);
      gl_FragColor = vec4(c.rgb, uOpacity);
    }`
  return (
    <mesh ref={mesh} position={[0,-0.4,0]} scale={[2.4,2.4,2.4]}>
      <planeGeometry args={[1,1,200,200]} />
      <shaderMaterial args={[{ uniforms, vertexShader: vs, fragmentShader: fs, transparent: true }]} />
    </mesh>
  )
}
