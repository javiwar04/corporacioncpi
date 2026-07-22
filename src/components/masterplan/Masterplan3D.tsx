"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Project, PropertyUnit } from "@/data/types";
import { statusMeta } from "@/lib/status";
import { formatArea } from "@/lib/format";

// Maqueta 3D de IMANA con la arquitectura real de las bodegas
// (cuerpo blanco + paneles azules + techo a un agua + fachada angular de vidrio + portón),
// garita con talanqueras y áreas verdes. Geometría procedural desde los polígonos.

const S = 0.02; // escala plano→mundo

// Paleta IMANA (de los renders/fotos oficiales)
const C = {
  wall: "#EDEFF2",
  wallSide: "#DDE1E6",
  blue: "#1C63C4",
  roof: "#C7CBD1",
  glass: "#7E8894",
  frame: "#E9B23C",
  door: "#1C63C4",
  concrete: "#CFCFC9",
  asphalt: "#8E8F8C",
  grass: "#7EA45B",
  trunk: "#6B5133",
  leaf: "#5C8A42",
};

function parsePoly(points?: string): [number, number][] {
  if (!points) return [];
  return points.trim().split(/\s+/).map((p) => {
    const [x, y] = p.split(",").map(Number);
    return [x, y] as [number, number];
  });
}
function bbox(pts: [number, number][]) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

// Ventana trapezoidal (fachada angular): base ancha, se afina hacia arriba.
function useFacadeShape(w: number, h: number) {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, -h / 2);
    s.lineTo(w / 2, -h / 2);
    s.lineTo(w * 0.3, h / 2);
    s.lineTo(-w * 0.3, h / 2);
    s.closePath();
    return s;
  }, [w, h]);
}

function BodegaBuilding({
  unit,
  W,
  H,
  dim,
  selected,
  onSelect,
}: {
  unit: PropertyUnit;
  W: number;
  H: number;
  dim: boolean;
  selected: boolean;
  onSelect: (u: PropertyUnit) => void;
}) {
  const [hover, setHover] = useState(false);
  const pts = useMemo(() => parsePoly(unit.polygonPoints), [unit.polygonPoints]);
  const b = pts.length >= 3 ? bbox(pts) : null;
  const m = statusMeta(unit.status);
  const selectable = m.selectable;

  const fw = b ? (b.maxX - b.minX) * S : 3; // ancho footprint
  const fd = b ? (b.maxY - b.minY) * S : 3; // profundidad footprint
  const facadeW = Math.min(fw * 0.42, 2.6);
  const facadeShape = useFacadeShape(facadeW, 1);

  if (!b) return null;

  const wx = ((b.minX + b.maxX) / 2 - W / 2) * S;
  const wz = ((b.minY + b.maxY) / 2 - H / 2) * S;
  const area = unit.constructionArea ?? 800;
  const h = 2.3 + Math.min(area, 2000) / 1400; // altura del cuerpo

  const bw = fw * 0.9;
  const bd = fd * 0.86;
  // La fachada mira hacia el pasillo central (z=0): Norte (wz<0) mira +z, Sur mira -z.
  const facadeDir = wz < 0 ? 1 : -1;
  const rot = facadeDir === 1 ? 0 : Math.PI;

  const raised = (hover || selected) && selectable;
  const lift = raised ? 0.25 : 0;

  const glassMat = (
    <meshStandardMaterial color={C.glass} roughness={0.15} metalness={0.5} transparent opacity={0.9} />
  );

  return (
    <group
      position={[wx, lift, wz]}
      onPointerOver={(e) => {
        if (!selectable) return;
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        if (!selectable) return;
        e.stopPropagation();
        onSelect(unit);
      }}
    >
      {/* Pad de estado (disponibilidad) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fw + 0.15, fd + 0.15]} />
        <meshStandardMaterial
          color={m.color}
          transparent
          opacity={dim ? 0.12 : raised ? 0.55 : 0.3}
          emissive={m.color}
          emissiveIntensity={raised ? 0.4 : 0.12}
        />
      </mesh>

      <group rotation={[0, rot, 0]}>
        {/* Cuerpo principal (muros blancos) */}
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[bw, h, bd]} />
          <meshStandardMaterial color={dim ? C.wallSide : C.wall} roughness={0.85} />
        </mesh>

        {/* Techo a un agua (más alto al frente) */}
        <mesh position={[0, h + 0.12, 0]} rotation={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[bw * 0.98, 0.14, bd * 1.02]} />
          <meshStandardMaterial color={C.roof} roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Lucernarios (ranuras oscuras del techo) */}
        {[-0.25, 0, 0.25].map((f, i) => (
          <mesh key={i} position={[bw * f, h + 0.22, 0]} rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.12, 0.03, bd * 0.7]} />
            <meshStandardMaterial color="#3A4048" />
          </mesh>
        ))}

        {/* Paneles azules en las esquinas frontales */}
        {[-1, 1].map((sx) => (
          <mesh key={sx} position={[(sx * bw) / 2, h / 2, bd / 2 - 0.15]} castShadow>
            <boxGeometry args={[0.22, h, 0.42]} />
            <meshStandardMaterial color={C.blue} roughness={0.6} metalness={0.15} />
          </mesh>
        ))}

        {/* Fachada angular de vidrio + marco amarillo (frente = +z) */}
        <group position={[-bw * 0.13, h * 0.42, bd / 2 + 0.02]} scale={[1, h * 0.62, 1]}>
          {/* marco amarillo (ligeramente mayor, detrás) */}
          <mesh position={[0, 0, -0.02]} scale={[1.08, 1.08, 1]}>
            <extrudeGeometry args={[facadeShape, { depth: 0.06, bevelEnabled: false }]} />
            <meshStandardMaterial color={C.frame} emissive={C.frame} emissiveIntensity={0.35} roughness={0.4} />
          </mesh>
          <mesh>
            <extrudeGeometry args={[facadeShape, { depth: 0.12, bevelEnabled: false }]} />
            {glassMat}
          </mesh>
        </group>

        {/* Portón azul (a un lado de la fachada) */}
        <mesh position={[bw * 0.28, h * 0.34, bd / 2 + 0.03]} castShadow>
          <boxGeometry args={[Math.min(bw * 0.26, 1.6), h * 0.6, 0.08]} />
          <meshStandardMaterial color={C.door} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Etiqueta flotante */}
      {selectable && !dim && (
        <Html position={[0, h + 0.9, 0]} center distanceFactor={22} occlude={false}>
          <div
            style={{
              padding: "3px 9px",
              borderRadius: 999,
              background: selected ? C.frame : "rgba(8,5,62,0.92)",
              color: selected ? "#08053E" : "#fff",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "var(--font-sans),sans-serif",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(8,5,62,0.4)",
              pointerEvents: "none",
            }}
          >
            {unit.code.replace("Bodega ", "B")}
            {unit.constructionArea ? ` · ${formatArea(unit.constructionArea)}` : ""}
          </div>
        </Html>
      )}
    </group>
  );
}

// Talanquera (barrera): poste + brazo horizontal que cruza el carril (a lo largo de z).
function Talanquera({ position, dir = 1 }: { position: [number, number, number]; dir?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 1, 12]} />
        <meshStandardMaterial color="#EAEAEA" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.92, dir * 0.85]} castShadow>
        <boxGeometry args={[0.12, 0.12, 1.7]} />
        <meshStandardMaterial color="#E23B3B" />
      </mesh>
    </group>
  );
}

// Garita de seguridad (cubo blanco/azul con techo).
function Garita({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial color={C.wall} roughness={0.8} />
      </mesh>
      <mesh position={[0.9, 0.9, 0]} castShadow>
        <boxGeometry args={[0.12, 1.8, 1.8]} />
        <meshStandardMaterial color={C.blue} />
      </mesh>
      <mesh position={[0, 1.86, 0]} castShadow>
        <boxGeometry args={[2.1, 0.14, 2.1]} />
        <meshStandardMaterial color={C.roof} />
      </mesh>
      {/* ventana */}
      <mesh position={[0, 1.0, 0.91]}>
        <boxGeometry args={[1.0, 0.7, 0.05]} />
        <meshStandardMaterial color={C.glass} metalness={0.4} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1, 8]} />
        <meshStandardMaterial color={C.trunk} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.9, 2, 10]} />
        <meshStandardMaterial color={C.leaf} roughness={1} />
      </mesh>
    </group>
  );
}

// Libera el contexto WebGL al desmontar (evita que se acumulen contextos
// al alternar entre Plano 2D y Maqueta 3D).
function ContextDisposer() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    return () => {
      try {
        gl.forceContextLoss();
        gl.dispose();
      } catch {
        /* noop */
      }
    };
  }, [gl]);
  return null;
}

export default function Masterplan3D({
  project,
  selectedId,
  matchedIds,
  onSelect,
}: {
  project: Project;
  selectedId?: string;
  matchedIds: Set<string>;
  onSelect: (u: PropertyUnit) => void;
}) {
  const W = project.masterplanWidth ?? 1332;
  const H = project.masterplanHeight ?? 665;
  const worldW = W * S;
  const worldH = H * S;

  // Borde oeste del complejo (donde está el ingreso, según el plano)
  const entranceX = useMemo(() => {
    const xs = project.units
      .map((u) => parsePoly(u.polygonPoints))
      .filter((p) => p.length >= 3)
      .map((p) => (bbox(p).minX - W / 2) * S);
    return xs.length ? Math.min(...xs) : -worldW / 2;
  }, [project.units, W, worldW]);

  const trees = useMemo(() => {
    const arr: { pos: [number, number, number]; s: number }[] = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 16; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = -worldW / 2 - 1.5 + rnd() * (worldW + 3);
      const z = side * (worldH / 2 + 1.2 + rnd() * 2.5);
      arr.push({ pos: [x, 0, z], s: 0.8 + rnd() * 0.7 });
    }
    return arr;
  }, [worldW, worldH]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [-4, 18, 20], fov: 40 }}
      resize={{ offsetSize: true }}
      gl={{ powerPreference: "default", failIfMajorPerformanceCaveat: false, antialias: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false
        );
      }}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
    >
      <ContextDisposer />
      <color attach="background" args={["#AFC8E6"]} />
      <fog attach="fog" args={["#C7D6E8", 30, 70]} />
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#eaf2ff", "#8a9a70", 0.6]} />
      <directionalLight
        position={[14, 24, 10]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Césped perimetral */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[worldW + 14, worldH + 14]} />
        <meshStandardMaterial color={C.grass} roughness={1} />
      </mesh>
      {/* Explanada de concreto */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[worldW + 3, worldH + 3]} />
        <meshStandardMaterial color={C.concrete} roughness={0.95} />
      </mesh>
      {/* Pasillo central (asfalto) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[worldW - 2, worldH * 0.32]} />
        <meshStandardMaterial color={C.asphalt} roughness={1} />
      </mesh>

      {project.units.map((u) => (
        <BodegaBuilding
          key={u.id}
          unit={u}
          W={W}
          H={H}
          dim={!matchedIds.has(u.id)}
          selected={selectedId === u.id}
          onSelect={onSelect}
        />
      ))}

      {/* Garita centrada en el ingreso, entre las dos primeras bodegas, con
          talanqueras a cada lado (carriles de acceso), como en el render oficial. */}
      <Garita position={[entranceX - 2.1, 0, 0]} />
      <Talanquera position={[entranceX - 0.9, 0, 1.9]} dir={-1} />
      <Talanquera position={[entranceX - 0.9, 0, -1.9]} dir={1} />

      {trees.map((t, i) => (
        <Tree key={i} position={t.pos} scale={t.s} />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={10}
        maxDistance={55}
        minPolarAngle={0.15}
        maxPolarAngle={1.4}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}
