
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'


type GLTFResult = GLTF & {
  nodes: {
    'human-heart-cutaway': THREE.Mesh
  }
  materials: {
    Material_0: THREE.MeshStandardMaterial
  }
}

interface HeartModelProps {
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function HeartModel({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: HeartModelProps) {
 const { nodes, materials } = useGLTF(
  '/models/heart-cutaway.glb',
) as unknown as GLTFResult
  return (
    <group
      dispose={null}
      scale={scale}
      position={position}
      rotation={rotation}
    >
      <mesh
        geometry={nodes['human-heart-cutaway'].geometry}
        material={materials.Material_0}
        castShadow
        receiveShadow
      />
    </group>
  )
}

useGLTF.preload('/models/heart-cutaway.glb')
