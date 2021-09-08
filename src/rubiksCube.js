import * as THREE from 'three'
import { RoundedBoxBufferGeometry } from 'three/examples/jsm/geometries/RoundedBoxBufferGeometry';


const textureLoader = new THREE.TextureLoader()
const displacementMap = textureLoader.load('/textures/displacement.png')

/**
 * Branch class using a cylinder that tapers towards the end.
 */
export default class RubiksCube {

    constructor(size, envMap, scene) {
        this.cubeMatrix = new Array(4).fill(0).map(() => new Array(4).fill(0).map(() => new Array(4).fill(0)));
        this.cubeGroup = new THREE.Group()
        let materials = []

        console.log(this.cubeMatrix);

        for (let i = 0; i < 6; i++) {
            const material = new THREE.MeshStandardMaterial({
                map: textureLoader.load('./textures/' + i + '.png'),
                envMap: envMap,
                // wireframe: true
            })
            material.displacementMap = displacementMap
            material.roughness = 0.25
            material.metalness = 0.25
            materials.push(material);
        }

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const cubeMesh = new THREE.Mesh(
                        new RoundedBoxBufferGeometry(1, 1, 1, 6, 0.07),
                        materials
                    )
                    cubeMesh.position.set(
                        x - (size - 1) / 2,
                        y - (size - 1) / 2,
                        z - (size - 1) / 2)
                    this.cubeMatrix[x][y][z] = cubeMesh
                    this.cubeGroup.add(cubeMesh)
                }
            }
        }
        scene.add(this.cubeGroup)

    }

    updateMaterial(cubeMaterialProps) {

        for (let i = 0; i < this.cubeGroup.children.length; i++) {
            const element = this.cubeGroup.children[i];
            for (let ii = 0; ii < element.material.length; ii++) {
                const material = element.material[ii]
                material.metalness = cubeMaterialProps.metalness
                material.roughness = cubeMaterialProps.roughness
            }
        }
    }

}