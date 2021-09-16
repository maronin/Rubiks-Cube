import * as THREE from 'three'
import { RoundedBoxBufferGeometry } from 'three/examples/jsm/geometries/RoundedBoxBufferGeometry';
import gsap from "gsap"
import envMap from './environmentMap'
import Arrow3D from './arrow3D'

const textureLoader = new THREE.TextureLoader()
const displacementMap = textureLoader.load('./textures/displacement.png')

/**
 * Branch class using a cylinder that tapers towards the end.
 */
export default class RubiksCube {

    constructor(size, scene) {
        this.cubeMatrix = new Array(size).fill(0).map(() => new Array(size).fill(0).map(() => new Array(size).fill(0)));
        this.cubes = []
        this.arrows = []
        this.rotating = false
        this.scene = scene
        let materials = []

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
                    cubeMesh.name = x + "" + y + "" + z
                    cubeMesh.position.set(
                        x - (size - 1) / 2,
                        y - (size - 1) / 2,
                        z - (size - 1) / 2)
                    this.cubeMatrix[x][y][z] = cubeMesh
                    this.cubes.push(cubeMesh)

                    // If its a corner piece
                    if (y == size - 1) {
                        if (x == size - 1 || x == 0) {
                            if (z == size - 1 || z == 0) {

                                const arrow = new Arrow3D(new THREE.Vector3())
                                arrow.position.copy(cubeMesh.position)
                                const arrow2 = new Arrow3D(new THREE.Vector3())

                                if (y == size - 1) {
                                    arrow.position.y += 0.3
                                    arrow2.position.copy(arrow.position)
                                    arrow2.rotation.copy(arrow.rotation)
                                    if (x == 2 && z == 2) {
                                        arrow2.rotation.y += Math.PI
                                        arrow2.rotation.z += Math.PI * 90 / 180
                                        arrow2.position.x += 0.3
                                        arrow2.position.y -= 0.3

                                    } else if (x == 0 && z == 2) {
                                        arrow.rotation.y = Math.PI * 270 / 180

                                        arrow2.rotation.y += Math.PI * 90 / 180
                                        arrow2.rotation.z += Math.PI * 90 / 180
                                        arrow2.position.z += 0.3
                                        arrow2.position.y -= 0.3

                                    } else if (x == 0 && z == 0) {
                                        arrow.rotation.y = Math.PI * 180 / 180

                                        arrow2.rotation.z += Math.PI * 90 / 180
                                        arrow2.position.x -= 0.3
                                        arrow2.position.y -= 0.3
                                    } else if (x == 2 && z == 0) {
                                        arrow.rotation.y = Math.PI * 90 / 180

                                        arrow2.rotation.y += Math.PI * 270 / 180
                                        arrow2.rotation.z += Math.PI * 90 / 180
                                        arrow2.position.z -= 0.3
                                        arrow2.position.y -= 0.3
                                    }
                                }

                                scene.add(arrow2)
                                scene.add(arrow)
                                this.arrows.push(arrow, arrow2)

                            }
                        }
                    }
                    scene.add(cubeMesh)
                }
            }
        }
    }


    /**
     * 
     * @param {number} times how many times to randomize
     * @param {number} speed how fast to do each rotation
     */
    randomizeCube(times, speed) {
        const thisRubiksCube = this
        if (times > 0) {
            const randomAxis = THREE.MathUtils.randInt(0, 2)
            const randomCubeSectionIndex = THREE.MathUtils.randInt(-1, 1)
            this.rotateCubeSection(randomAxis, randomCubeSectionIndex, 90, speed, function() {
                thisRubiksCube.randomizeCube(--times, speed)
            })
        }
    }

    /**
     * Rotate the cube sections based on the pass in parameters
     * @param {number} axis on which axis is it turning? x=0, y=1, z=2
     * @param {number} cubeSectionIndex which section of the cube?
     * @param {number} angle by how much to do the rotation
     * @param {number} speed how fast to do the rotation
     * @param {function} callBack callBack function
     */
    rotateCubeSection(axis, cubeSectionIndex, angle, speed = 0.25, callBack = null) {

        if (!this.rotating) {
            this.rotating = true
            const group = new THREE.Group()

            this.scene.add(group)

            this.cubes.forEach(cube => {
                if (cube.position.round().toArray()[axis] == cubeSectionIndex) {
                    group.add(cube)
                }
            });

            const thisRubiksCube = this

            gsap.to(group.rotation, {
                duration: speed,
                x: axis == 0 ? group.rotation.x + (angle * Math.PI / 180) : group.rotation.x,
                y: axis == 1 ? group.rotation.y + (angle * Math.PI / 180) : group.rotation.y,
                z: axis == 2 ? group.rotation.y + (angle * Math.PI / 180) : group.rotation.z,
                ease: "back", //https://greensock.com/docs/v2/Easing
                onComplete: function() {

                    const groupedCubes = []
                    group.children.forEach(cube => {
                        groupedCubes.push(cube)
                    });

                    groupedCubes.forEach(cube => {
                        thisRubiksCube.scene.attach(cube)
                    });
                    thisRubiksCube.rotating = false
                    thisRubiksCube.scene.remove(group)
                    if (callBack) callBack()
                }
            })
        }
    }


    /**
     * Update the materials for the cube, controls roughness and metalness
     * @param {Object} cubeMaterialProps material properties for the cube
     */
    updateMaterial(cubeMaterialProps) {

        for (let i = 0; i < this.cubes.length; i++) {
            const element = this.cubes[i];
            for (let ii = 0; ii < element.material.length; ii++) {
                const material = element.material[ii]
                material.metalness = cubeMaterialProps.metalness
                material.roughness = cubeMaterialProps.roughness
            }
        }
    }

}