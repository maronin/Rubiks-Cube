import * as THREE from 'three'
import envMap from './environmentMap'


const opacity = 0.25
export default class Arrow3D extends THREE.Group {
    constructor(pos = new THREE.Vector3(), rot = new THREE.Vector3(), axes, cubeSection, forward) {
        super()
        this.axes = axes
        this.cubeSection = cubeSection
        this.forward = forward
        const arrowMaterial = new THREE.MeshStandardMaterial({
            envMap: envMap,
            metalness: 0.2,
            roughness: 1,
            color: "lime",
            transparent: true,
            opacity: opacity
        })
        const arrowBody = new THREE.Mesh(
            // new THREE.CylinderBufferGeometry(.1, .1, 1, 18, 1),
            new THREE.TorusBufferGeometry(.45, .075, 16, 20, Math.PI / 4),
            arrowMaterial
        )
        const arrowHead = new THREE.Mesh(
            new THREE.ConeBufferGeometry(.15, .3, 18, 2),
            arrowMaterial
        )

        arrowBody.rotation.z = Math.PI / 4
        arrowBody.position.y += 0.3
        arrowBody.position.x += 0.3

        arrowHead.position.x += .15
        arrowHead.position.y += .75
        arrowHead.rotation.z = Math.PI / 2


        this.position.copy(pos)
        this.rotation.copy(rot)
        this.add(arrowHead)
        this.add(arrowBody)


        return this
    }


    highlight() {
        this.children.forEach(child => {
            child.material.opacity = 1
        });
    }

    hide() {
        this.children.forEach(child => {
            child.material.opacity = opacity
        });
    }

    clicked(object, rubiksCube) {
        rubiksCube.rotateCubeSection(this.axes, this.cubeSection, 90 * (this.forward ? 1 : -1))
    }
}