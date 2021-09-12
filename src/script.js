import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import * as dat from 'dat.gui'
import RubiksCube from './rubiksCube'

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
// const controls = new TrackballControls(camera, canvas) // use this when I get better UI for rotating cube sections
const controls = new OrbitControls(camera, canvas)
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
    // scene.add(axesHelper)


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

// Dynamic size doesn't work yet, only use 3
const rubiksCube = new RubiksCube(3, environmentMap, scene)

const cubeMaterialFolder = gui.addFolder("Cube Material")
cubeMaterialFolder.open()
cubeMaterialFolder.add(cubeMaterialProps, 'metalness', 0, 1, 0.0001).onChange(() => {
    rubiksCube.updateMaterial(cubeMaterialProps)
})
cubeMaterialFolder.add(cubeMaterialProps, 'roughness', 0, 1, 0.0001).onChange(() => {
    rubiksCube.updateMaterial(cubeMaterialProps)
})

// Buttons for rotating the X
const rotateX0B = () => { rubiksCube.rotateCubeSection(0, -1, -90) }
const rotateX1B = () => { rubiksCube.rotateCubeSection(0, 0, -90) }
const rotateX2B = () => { rubiksCube.rotateCubeSection(0, 1, -90) }
const rotateX0F = () => { rubiksCube.rotateCubeSection(0, -1, 90) }
const rotateX1F = () => { rubiksCube.rotateCubeSection(0, 0, 90) }
const rotateX2F = () => { rubiksCube.rotateCubeSection(0, 1, 90) }

// Buttons for rotating the Y
const rotateY0B = () => { rubiksCube.rotateCubeSection(1, -1, -90) }
const rotateY1B = () => { rubiksCube.rotateCubeSection(1, 0, -90) }
const rotateY2B = () => { rubiksCube.rotateCubeSection(1, 1, -90) }
const rotateY0F = () => { rubiksCube.rotateCubeSection(1, -1, 90) }
const rotateY1F = () => { rubiksCube.rotateCubeSection(1, 0, 90) }
const rotateY2F = () => { rubiksCube.rotateCubeSection(1, 1, 90) }

// Buttons for rotating the Z
const rotateZ0B = () => { rubiksCube.rotateCubeSection(2, -1, -90) }
const rotateZ1B = () => { rubiksCube.rotateCubeSection(2, 0, -90) }
const rotateZ2B = () => { rubiksCube.rotateCubeSection(2, 1, -90) }
const rotateZ0F = () => { rubiksCube.rotateCubeSection(2, -1, 90) }
const rotateZ1F = () => { rubiksCube.rotateCubeSection(2, 0, 90) }
const rotateZ2F = () => { rubiksCube.rotateCubeSection(2, 1, 90) }

// Randomize the cube
const randomizeCube = () => { rubiksCube.randomizeCube(60, 0.025) }

const cubeRotations = {
    rotateX0B,
    rotateX1B,
    rotateX2B,
    rotateX0F,
    rotateX1F,
    rotateX2F,
    rotateY0B,
    rotateY1B,
    rotateY2B,
    rotateY0F,
    rotateY1F,
    rotateY2F,
    rotateZ0B,
    rotateZ1B,
    rotateZ2B,
    rotateZ0F,
    rotateZ1F,
    rotateZ2F,
    randomizeCube
}

const rotateCubeFolder = gui.addFolder("Rotate")
rotateCubeFolder.open()

rotateCubeFolder.add(cubeRotations, "randomizeCube")

const rotateXFolder = rotateCubeFolder.addFolder("X")
    // rotateXFolder.open()

const rotateYFolder = rotateCubeFolder.addFolder("Y")
    // rotateYFolder.open()

const rotateZFolder = rotateCubeFolder.addFolder("Z")
    // rotateZFolder.open()

rotateXFolder.add(cubeRotations, "rotateX0B")
rotateXFolder.add(cubeRotations, "rotateX0F")
rotateXFolder.add(cubeRotations, "rotateX1B")
rotateXFolder.add(cubeRotations, "rotateX1F")
rotateXFolder.add(cubeRotations, "rotateX2B")
rotateXFolder.add(cubeRotations, "rotateX2F")

rotateYFolder.add(cubeRotations, "rotateY0B")
rotateYFolder.add(cubeRotations, "rotateY0F")
rotateYFolder.add(cubeRotations, "rotateY1B")
rotateYFolder.add(cubeRotations, "rotateY1F")
rotateYFolder.add(cubeRotations, "rotateY2B")
rotateYFolder.add(cubeRotations, "rotateY2F")

rotateZFolder.add(cubeRotations, "rotateZ0B")
rotateZFolder.add(cubeRotations, "rotateZ0F")
rotateZFolder.add(cubeRotations, "rotateZ1B")
rotateZFolder.add(cubeRotations, "rotateZ1F")
rotateZFolder.add(cubeRotations, "rotateZ2B")
rotateZFolder.add(cubeRotations, "rotateZ2F")

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