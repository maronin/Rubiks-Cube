import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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


const axesHelper = new THREE.AxesHelper()
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
    roughness: 0,
    metalness: 0
}


const cube = new RubiksCube(2, 0, environmentMap, scene)

const cubeMaterialFolder = gui.addFolder("Cube Material")
cubeMaterialFolder.open()
cubeMaterialFolder.add(cubeMaterialProps, 'metalness', 0, 1, 0.0001).onChange(() => {
    cube.updateMaterial(cubeMaterialProps)
})
cubeMaterialFolder.add(cubeMaterialProps, 'roughness', 0, 1, 0.0001).onChange(() => {
    cube.updateMaterial(cubeMaterialProps)
})

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

    cube.cubeGroup.rotation.x += 0.005
    cube.cubeGroup.rotation.y += 0.005
}

animate()