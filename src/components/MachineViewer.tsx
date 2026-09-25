'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { PART_NODES } from '@/lib/partNodes'

type P = { slug: string; name: string }
type Props = { parts: P[]; selected: string; onSelect: (slug: string) => void; xray: boolean; resetKey: number }

const MODEL = '/models/shunfa-sf5550.gltf'
const HOME_TARGET = new THREE.Vector3(0.0, 0.99, 0)
const HOME_DIR = new THREE.Vector3(0.28, 0.22, 1).normalize()
const HOME_DIST = 1.25
const GHOST = 0.3
const GOLD = new THREE.Color('#E59B1C')
const DENIM = new THREE.Color('#22336B')

type Fly = { t0: number; dur: number; p0: THREE.Vector3; p1: THREE.Vector3; t0v: THREE.Vector3; t1v: THREE.Vector3 }

export default function MachineViewer({ parts, selected, onSelect, xray, resetKey }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const dots = useRef<Record<string, HTMLButtonElement | null>>({})
  const api = useRef<{ focus: (slug: string | null) => void; style: (slug: string, xray: boolean) => void } | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const el = box.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setStatus('error')
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.prepend(renderer.domElement)
    renderer.domElement.className = 'block h-full w-full'

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.65
    const key = new THREE.DirectionalLight('#ffffff', 1.1)
    key.position.set(1, 2, 2)
    scene.add(key)

    const camera = new THREE.PerspectiveCamera(35, 1, 0.02, 20)
    camera.position.copy(HOME_TARGET).addScaledVector(HOME_DIR, HOME_DIST)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.copy(HOME_TARGET)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 0.15
    controls.maxDistance = 3.2
    controls.maxPolarAngle = Math.PI / 2 + 0.25

    let dirty = true
    let fly: Fly | null = null
    let raf = 0
    let disposed = false
    const meshes: THREE.Mesh[] = []
    const groups: Record<string, THREE.Mesh[]> = {}
    const centers: Record<string, THREE.Vector3> = {}
    const boxes: Record<string, THREE.Box3> = {}
    const v = new THREE.Vector3()

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      dirty = true
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    const flyTo = (target: THREE.Vector3, dist: number, resetSide = false) => {
      const dir = camera.position.clone().sub(controls.target).normalize()
      if (resetSide && dir.z < 0.1) dir.z = Math.abs(dir.z) + 0.3
      dir.normalize()
      fly = {
        t0: performance.now(), dur: reduce ? 1 : 750,
        p0: camera.position.clone(), p1: target.clone().addScaledVector(dir, dist),
        t0v: controls.target.clone(), t1v: target.clone(),
      }
      dirty = true
    }

    api.current = {
      focus(slug) {
        if (!slug) return flyTo(HOME_TARGET, HOME_DIST, true)
        const b = boxes[slug]
        if (!b) return
        const size = b.getSize(new THREE.Vector3())
        const dist = THREE.MathUtils.clamp(Math.max(size.x, size.y, size.z) * 3.4, 0.42, 1.9)
        flyTo(centers[slug], dist, true)
      },
      style(slug, ghost) {
        const on = new Set(groups[slug] ?? [])
        meshes.forEach(m => {
          m.userData.opTarget = on.has(m) || !ghost ? 1 : GHOST
          m.userData.glowTarget = on.has(m) ? 1 : 0
        })
        dirty = true
      },
    }

    new GLTFLoader().load(
      MODEL,
      gltf => {
        if (disposed) return
        scene.add(gltf.scene)
        gltf.scene.updateMatrixWorld(true)
        gltf.scene.traverse(o => {
          const m = o as THREE.Mesh
          if (!m.isMesh) return
          m.material = (m.material as THREE.MeshStandardMaterial).clone() // materials are shared; each mesh needs its own to fade/glow
          m.userData.base = (m.material as THREE.MeshStandardMaterial).color.clone()
          m.userData.op = 1; m.userData.opTarget = 1; m.userData.glow = 0; m.userData.glowTarget = 0
          meshes.push(m)
        })
        for (const p of parts) {
          const ms = (PART_NODES[p.slug] ?? []).map(n => gltf.scene.getObjectByName(n)).filter((o): o is THREE.Mesh => !!(o as THREE.Mesh)?.isMesh)
          if (!ms.length) continue
          const b = new THREE.Box3()
          ms.forEach(m => b.expandByObject(m))
          groups[p.slug] = ms
          boxes[p.slug] = b
          centers[p.slug] = b.getCenter(new THREE.Vector3())
        }
        setStatus('ready')
      },
      undefined,
      () => !disposed && setStatus('error'),
    )

    // Tap a part to select it, but ignore drags (those rotate the model)
    let down: { x: number; y: number; t: number } | null = null
    const ray = new THREE.Raycaster()
    const cv = renderer.domElement
    const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY, t: performance.now() } }
    const onUp = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 || performance.now() - down.t > 600) return
      const r = cv.getBoundingClientRect()
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera)
      const hit = ray.intersectObjects(meshes, false)[0]
      const slug = hit && Object.keys(groups).find(s => groups[s].includes(hit.object as THREE.Mesh))
      if (slug) onSelectRef.current(slug)
    }
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointerup', onUp)
    controls.addEventListener('change', () => (dirty = true))

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (fly) {
        const k = Math.min(1, (performance.now() - fly.t0) / fly.dur)
        const e = 1 - Math.pow(1 - k, 3)
        camera.position.lerpVectors(fly.p0, fly.p1, e)
        controls.target.lerpVectors(fly.t0v, fly.t1v, e)
        if (k >= 1) fly = null
        dirty = true
      }
      const moved = controls.update()
      for (const m of meshes) {
        const mat = m.material as THREE.MeshStandardMaterial
        const u = m.userData
        if (Math.abs(u.op - u.opTarget) > 0.004 || Math.abs(u.glow - u.glowTarget) > 0.004) {
          u.op += (u.opTarget - u.op) * 0.2
          u.glow += (u.glowTarget - u.glow) * 0.2
          mat.opacity = u.op
          mat.transparent = u.op < 0.995
          mat.depthWrite = u.op >= 0.995
          mat.color.copy(u.base).lerp(DENIM, ((1 - u.op) / (1 - GHOST)) * 0.7) // ghosted parts read as a blue x-ray
          mat.emissive.copy(GOLD)
          mat.emissiveIntensity = u.glow * 0.6
          dirty = true
        }
      }
      if (!dirty && !moved) return
      dirty = false
      renderer.render(scene, camera)
      // Keep the tappable dots pinned to their parts
      const w = el.clientWidth, h = el.clientHeight
      for (const p of parts) {
        const d = dots.current[p.slug], c = centers[p.slug]
        if (!d || !c) continue
        v.copy(c).project(camera)
        const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h
        const vis = v.z < 1 && x > 8 && x < w - 8 && y > 8 && y < h - 8
        d.style.display = vis ? '' : 'none'
        d.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      }
    }
    loop()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointerup', onUp)
      controls.dispose()
      meshes.forEach(m => { m.geometry.dispose(); (m.material as THREE.Material).dispose() })
      pmrem.dispose()
      renderer.dispose()
      cv.remove()
      api.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (status !== 'ready') return
    api.current?.style(selected, xray)
  }, [status, selected, xray])
  useEffect(() => {
    if (status === 'ready') api.current?.focus(selected)
  }, [status, selected])
  useEffect(() => {
    if (status === 'ready' && resetKey > 0) api.current?.focus(null)
  }, [resetKey, status])

  return (
    <div ref={box} className="relative h-[340px] touch-none overflow-hidden rounded-lg border border-border bg-denim-light sm:h-[460px]">
      <div className="pointer-events-none absolute inset-0" role="img" aria-label="Interactive 3D model of a sewing machine. Use the part buttons below the model to choose a part." />
      {status === 'ready' && parts.map(p => {
        const active = p.slug === selected
        return (
          <button
            key={p.slug}
            ref={n => { dots.current[p.slug] = n }}
            onClick={() => onSelect(p.slug)}
            aria-label={p.name}
            aria-pressed={active}
            style={{ display: 'none', zIndex: active ? 2 : 1 }}
            className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full"
          >
            <span className={`block rounded-full border-2 transition-all duration-150 ${active ? 'h-5 w-5 border-denim-deep bg-denim ring-4 ring-denim/20' : 'h-3.5 w-3.5 border-thread bg-paper'}`} />
          </button>
        )
      })}
      {status === 'loading' && <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">Loading 3D model…</p>}
      {status === 'error' && (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted">
          The 3D model can&apos;t load on this device. Choose a part from the buttons below.
        </p>
      )}
    </div>
  )
}
