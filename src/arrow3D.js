import * as THREE from 'three'
import envMap from './environmentMap'


const opacity = 0.15
export default class Arrow3D extends THREE.Group {
    constructor(pos) {
        super()
        const arrowMaterial = new THREE.MeshStandardMaterial({
            envMap: envMap,
            metalness: 0.2,
            roughness: 1,
            color: "white",
            transparent: true,
            opacity: opacity
        })
        const arrowBody = new THREE.Mesh(
            // new THREE.CylinderBufferGeometry(.1, .1, 1, 18, 1),
            new THREE.TorusBufferGeometry(.3, .05, 16, 20, Math.PI / 4),
            arrowMaterial
        )
        const arrowHead = new THREE.Mesh(
            new THREE.ConeBufferGeometry(.10, .2, 18, 2),
            arrowMaterial
        )
        const axesHelper = new THREE.AxesHelper(1)
            // this.add(axesHelper)
        arrowBody.rotation.z = Math.PI / 4

        arrowBody.position.x = .2
        arrowHead.position.x += .1
        arrowHead.position.y += .3
        arrowHead.rotation.z = Math.PI / 2


        this.position.copy(pos)
        this.add(arrowHead)
        this.add(arrowBody)
        this.scale.set(1.5, 1.5, 1.5)

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
}