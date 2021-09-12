import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import RubiksCube from './rubiksCube'
import gsap from "gsap"

/****************************************************************
 * Boilerplate ThreeJS stuff
 ****************************************************************/

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, -1)


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.x = 0
camera.position.y = 4
camera.position.z = 4


const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    './textures/environmentMaps/colorful studio/px.png',
    './textures/environmentMaps/colorful studio/nx.png',
    './textures/environmentMaps/colorful studio/py.png',
    './textures/environmentMaps/colorful studio/ny.png',
    './textures/environmentMaps/colorful studio/pz.png',
    './textures/environmentMaps/colorful studio/nz.png',
])


/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color('white');
scene.background = environmentMap
scene.add(camera)
scene.add(ambientLight)
scene.add(directionalLight)


/**
 * Controls - Using Orbit Controls
 */
const controls = new OrbitControls(camera, canvas)
    // controls.target.copy(new THREE.Vector3(0, camera.position.y, 20));
controls.update()
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const axesHelper = new THREE.AxesHelper(6)
scene.add(axesHelper)




/**
 * Add an event listener for when the window gets resized.
 */
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/****************************************************************
 * Dat GUI
 ****************************************************************/

const gui = new dat.GUI()
gui.width = 350

/**
 * Lights UI
 */
const guiLightsFolder = gui.addFolder("Lights")
guiLightsFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
guiLightsFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
guiLightsFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
guiLightsFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
guiLightsFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)


const cubeMaterialProps = {
    roughness: 0.25,
    metalness: 0.25
}


const rubiksCube = new RubiksCube(3, environmentMap, scene)

const cubeMaterialFolder = gui.addFolder("Cube Material")
cubeMaterialFolder.open()
cubeMaterialFolder.add(cubeMaterialProps, 'metalness', 0, 1, 0.0001).onChange(() => {
    rubiksCube.updateMaterial(cubeMaterialProps)
})
cubeMaterialFolder.add(cubeMaterialProps, 'roughness', 0, 1, 0.0001).onChange(() => {
    rubiksCube.updateMaterial(cubeMaterialProps)
})

/**
 * 
 * @param {array} matrix 
 * @returns Returns the result rotated matrix
 */
//https://codereview.stackexchange.com/questions/186805/rotate-an-n-%C3%97-n-matrix-90-degrees-clockwise/186834
//https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
function rotate(matrix) {
    let result = [];
    for (let i = 0; i < matrix[0].length; i++) {
        let row = matrix.map(e => e[i]).reverse();
        result.push(row);
    }
    return result;
};


let rotating = false



function rotateCube(axis, cubeSectionIndex, angle) {
    if (!rotating) {
        rotating = true
        const group = new THREE.Group()
        scene.add(group)

        // This actually rotates the matrix
        // rubiksCube[0] = rotate(rubiksCube.cubeMatrix[0])

        const cubeMatrix = rubiksCube.cubeMatrix


        for (let i = 0; i < cubeMatrix.length; i++) {
            for (let ii = 0; ii < cubeMatrix.length; ii++) {
                let cube
                if (axis == "x") {
                    cube = cubeMatrix[cubeSectionIndex][i][ii]
                } else if (axis == "y") {
                    cube = cubeMatrix[i][cubeSectionIndex][ii]
                } else {
                    cube = cubeMatrix[i][ii][cubeSectionIndex]
                }
                group.add(cube)
            }
        }


        gsap.to(group.rotation, {
            duration: .25,
            x: axis == "x" ? group.rotation.x + (angle * Math.PI / 180) : group.rotation.x,
            y: axis == "y" ? group.rotation.y + (angle * Math.PI / 180) : group.rotation.y,
            z: axis == "z" ? group.rotation.y + (angle * Math.PI / 180) : group.rotation.z,
            ease: "back",
            onComplete: function() {

                const cubes = []
                group.children.forEach(cube => {
                    cubes.push(cube)
                });

                cubes.forEach(cube => {
                    scene.attach(cube)
                    console.log(cube);

                });
                rotating = false
                scene.remove(group)
            }
        })
    }
}


const cubeRotations = {
    rotateCube: rotateCube,
}

const rotateCubeFolder = gui.addFolder("Rotate")
rotateCubeFolder.open()

const rotateXFolder = rotateCubeFolder.addFolder("X")
rotateXFolder.open()

const rotateYFolder = rotateCubeFolder.addFolder("Y")
rotateYFolder.open()

const rotateZFolder = rotateCubeFolder.addFolder("Z")
rotateZFolder.open()

//https://stackoverflow.com/questions/26191484/dat-gui-function-invocation-with-parameters
rotateXFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "x", 0, -90) }, "rotateX").name("0-")
rotateXFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "x", 0, 90) }, "rotateX").name("0+")
rotateXFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "x", 1, -90) }, "rotateX").name("1-")
rotateXFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "x", 1, 90) }, "rotateX").name("1+")
rotateXFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "x", 2, -90) }, "rotateX").name("2-")
rotateXFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "x", 2, 90) }, "rotateX").name("2+")


rotateYFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "y", 0, -90) }, "rotateX").name("0-")
rotateYFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "y", 0, 90) }, "rotateX").name("0+")
rotateYFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "y", 1, -90) }, "rotateX").name("1-")
rotateYFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "y", 1, 90) }, "rotateX").name("1+")
rotateYFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "y", 2, -90) }, "rotateX").name("2-")
rotateYFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "y", 2, 90) }, "rotateX").name("2+")

rotateZFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "z", 0, -90) }, "rotateX").name("0-")
rotateZFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "z", 0, 90) }, "rotateX").name("0+")
rotateZFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "z", 1, -90) }, "rotateX").name("1-")
rotateZFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "z", 1, 90) }, "rotateX").name("1+")
rotateZFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "z", 2, -90) }, "rotateX").name("2-")
rotateZFolder.add({ rotateX: cubeRotations.rotateCube.bind(this, "z", 2, 90) }, "rotateX").name("2+")

/**
 * Animation
 */
function animate() {

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)

    // cube.cubeGroup.rotation.x += 0.005
    // cube.cubeGroup.rotation.y += 0.0025
}

animate()