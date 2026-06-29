'use client'
import { useRef, useMemo, forwardRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

/**
 * Satu pecahan geometry abstrak -- bentuknya icosahedron/octahedron yang
 * "dipotong" pakai random vertex displacement, jadi kerasa shard/fragmen,
 * bukan primitive polos. Material dark dengan rim-light pink (brand accent)
 * lewat meshStandardMaterial (metalness/roughness) + multi-light manual
 * (lihat lighting setup di FragmentScene di bawah) -- sengaja TIDAK pakai
 * Environment/HDRI dari drei karena itu fetch environment map dari CDN
 * eksternal yang jadi titik gagal (lihat catatan WebGL context lost di
 * bawah Canvas), jadi reflection/depth di sini murni dari light setup.
 *
 * forwardRef diteruskan ke RigidBody (bukan Float dari drei -- Float
 * memanipulasi local transform setiap frame secara independen, yang akan
 * "berebut" kontrol posisi dengan physics step Rapier dan menghasilkan
 * jitter. Gerakan melayang di sini murni dihasilkan oleh physics:
 * gravity sangat kecil + damping tinggi + gentle force periodik dari
 * parent scene lewat ref ini).
 */
const Shard = forwardRef(function Shard({ position, rotation, scale, geometryType, accentColor }, ref) {
  const geometry = useMemo(() => {
    const geo = geometryType === 'octa'
      ? new THREE.OctahedronGeometry(1, 0)
      : geometryType === 'tetra'
      ? new THREE.TetrahedronGeometry(1, 0)
      : new THREE.IcosahedronGeometry(1, 0)

    // Distorsi vertex acak ringan supaya kerasa "shard" yang pecah,
    // bukan polyhedron sempurna -- signature look brand ini.
    const posAttr = geo.attributes.position
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const y = posAttr.getY(i)
      const z = posAttr.getZ(i)
      const noise = 0.18
      posAttr.setXYZ(
        i,
        x + (Math.random() - 0.5) * noise,
        y + (Math.random() - 0.5) * noise,
        z + (Math.random() - 0.5) * noise
      )
    }
    geo.computeVertexNormals()
    return geo
  }, [geometryType])

  return (
    <RigidBody
      ref={ref}
      colliders="hull"
      position={position}
      rotation={rotation}
      linearDamping={3.5}
      angularDamping={2.5}
      gravityScale={0.04}
      restitution={0.3}
      linearVelocity={[
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
      ]}
      angularVelocity={[
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
      ]}
    >
      <mesh geometry={geometry} scale={scale}>
        <meshStandardMaterial
          color="#141414"
          metalness={0.55}
          roughness={0.35}
          emissive={accentColor}
          emissiveIntensity={0.08}
        />
      </mesh>
    </RigidBody>
  )
})

function InvisibleFloor() {
  return (
    <RigidBody type="fixed" position={[0, -4, 0]}>
      <mesh>
        <boxGeometry args={[40, 0.5, 40]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </RigidBody>
  )
}

/**
 * Apply gentle sinusoidal impulse ke tiap shard tiap frame -- ini yang
 * membuat shard "hidup" terus-menerus (tidak settle ke diam akibat
 * damping), tanpa perlu animasi transform manual yang akan konflik
 * dengan physics step.
 */
function AmbientMotion({ bodyRefs }) {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    bodyRefs.current.forEach((body, i) => {
      if (!body) return
      const phase = i * 1.7
      body.applyImpulse(
        {
          x: Math.sin(t * 0.4 + phase) * 0.0009,
          y: Math.cos(t * 0.3 + phase) * 0.0007,
          z: Math.sin(t * 0.25 + phase) * 0.0006,
        },
        true
      )
    })
  })
  return null
}

export default function FragmentScene({ onContextLost }) {
  const shards = useMemo(() => {
    const types = ['icosa', 'octa', 'tetra']
    const accents = ['#FF2D9B', '#FF2D9B', '#2A2A2A']
    return Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3 + 1,
        (Math.random() - 0.5) * 3 - 1,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 0.45 + Math.random() * 0.55,
      geometryType: types[i % types.length],
      accentColor: accents[i % accents.length],
    }))
  }, [])

  const bodyRefs = useRef([])

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        // "webglcontextlost" adalah browser-level event, bukan JS
        // exception -- React error boundary (lihat ErrorCatcher di
        // FragmentSceneLazy.jsx) TIDAK menangkap ini. Listener manual
        // ini yang memberitahu parent supaya fallback ke versi statis
        // dengan baik, daripada membiarkan canvas blank/freeze diam-diam.
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
          onContextLost?.()
        })
      }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#FF2D9B" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#FF2D9B" />
      <pointLight position={[3, 3, -2]} intensity={0.3} color="#ffffff" />

      <Suspense fallback={null}>
        <Physics gravity={[0, -1.2, 0]}>
          <InvisibleFloor />
          {shards.map((s, i) => (
            <Shard key={s.id} ref={(el) => (bodyRefs.current[i] = el)} {...s} />
          ))}
          <AmbientMotion bodyRefs={bodyRefs} />
        </Physics>
      </Suspense>
    </Canvas>
  )
}
