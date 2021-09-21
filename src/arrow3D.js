import * as THREE from 'three'
import envMap from './environmentMap'


const opacity = 1
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
            color: "white",
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
        const axesHelper = new THREE.AxesHelper(1)
            // this.add(axesHelper)
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




        // 


    }

    hide() {
        this.children.forEach(child => {
            child.material.opacity = opacity
        });
    }

    clicked(object, rubiksCube) {
        console.log("hello");
        rubiksCube.rotateCubeSection(this.axes, this.cubeSection, 90 * (this.forward ? 1 : -1))
            /*
            console.log(THREE.MathUtils.radToDeg(object.parent.rotation.x))
            console.log(THREE.MathUtils.radToDeg(object.parent.rotation.y))
            console.log(THREE.MathUtils.radToDeg(object.parent.rotation.z))
            console.log(this.parent.position);
            console.log(object)
            const rotX = THREE.MathUtils.radToDeg(this.rotation.x)
            const rotY = THREE.MathUtils.radToDeg(this.rotation.y)
            const rotZ = THREE.MathUtils.radToDeg(this.rotation.z)
            const posX = this.parent.position.x
            const posY = this.parent.position.y
            const posZ = this.parent.position.z
        
            if (posX == 1 && posY == 1 && posZ == -1) {
                if (rotX == 0 && rotY == 0 && rotZ == 0) {
                    rubiksCube.rotateCubeSection(2, posZ, 90)
                } else if (rotX == 180 && rotY == 0 && rotZ == 270) {
                    rubiksCube.rotateCubeSection(2, posZ, -90)
                }
            }
            //0,0,0 1,1, -1 = 0, 

            console.log("arrow clicked");*/
    }
}