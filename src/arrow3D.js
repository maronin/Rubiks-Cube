import * as THREE from 'three'
import envMap from './environmentMap'
const arrowMaterial = new THREE.MeshStandardMaterial({ envMap: envMap, metalness: 0.2, roughness: 1, color: "green" })
export default class Arrow3D extends THREE.Group {
    constructor(pos) {
        const group = new THREE.Group()
        const arrowBody = new THREE.Mesh(
            // new THREE.CylinderBufferGeometry(.1, .1, 1, 18, 1),
            new THREE.TorusBufferGeometry(.3, .05, 16, 20, Math.PI / 4),
            arrowMaterial
        )
        const arrowHead = new THREE.Mesh(
            new THREE.ConeBufferGeometry(.10, .2, 18, 2),
            arrowMaterial
        )

        arrowBody.rotation.z = Math.PI / 4
        arrowHead.position.x -= .1
        arrowHead.position.y += .3
        arrowHead.rotation.z = Math.PI / 2
        pos.y -= 0.3 / 2
        pos.x -= 0.3 / 2
        group.position.copy(pos)
        group.add(arrowHead)
        group.add(arrowBody)
        return group
    }
}