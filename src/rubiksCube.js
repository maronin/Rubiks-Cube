import * as THREE from 'three'
import { RoundedBoxBufferGeometry } from 'three/examples/jsm/geometries/RoundedBoxBufferGeometry';


const textureLoader = new THREE.TextureLoader()


/**
 * Branch class using a cylinder that tapers towards the end.
 */
export default class RubiksCube {

    constructor(size, spacing, envMap, scene) {
        this.cubeMatrix = [
            [
                [],
                [],
                []
            ],
            [
                [],
                [],
                []
            ],
            [
                [],
                [],
                []
            ]
        ]
        this.cubeGroup = new THREE.Group()
        let materials = []
        for (let i = 0; i < 6; i++) {
            const material = new THREE.MeshStandardMaterial({
                map: textureLoader.load('./textures/' + i + '.png'),
                envMap: envMap
            })
            material.roughness = 0.2
            material.metalness = 0.8
            materials.push(material);
        }

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    const cubeMesh = new THREE.Mesh(
                        new RoundedBoxBufferGeometry(size / 3, size / 3, size / 3),
                        materials
                    )

                    cubeMesh.position.set(
                        size / 3 * x - (size / 3) + (x * spacing) - spacing,
                        size / 3 * y - (size / 3) + (y * spacing) - spacing,
                        size / 3 * z - (size / 3) + (z * spacing) - spacing)
                    this.cubeMatrix[x][y][z] = cubeMesh
                    this.cubeGroup.add(cubeMesh)
                }
            }
        }
        scene.add(this.cubeGroup)
        console.log(this.cubeMatrix);
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