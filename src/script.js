import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import * as dat from 'dat.gui'
import RubiksCube from './rubiksCube'
import 'bootstrap/dist/css/bootstrap.min.css'
import Arrow3D from './arrow3D'
import envMap from './environmentMap'

/****************************************************************
 * Boilerplate ThreeJS stuff
 ****************************************************************/

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')
const frontCanvas = document.querySelector('canvas.front-cam')
const topCanvas = document.querySelector('canvas.top-cam')
const bottomCanvas = document.querySelector('canvas.bottom-cam')
const backCanvas = document.querySelector('canvas.back-cam')
const leftCanvas = document.querySelector('canvas.left-cam')
const rightCanvas = document.querySelector('canvas.right-cam')

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
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(1, 2, 1)


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3


const frontCamera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 1, 2)
frontCamera.position.x = 0
frontCamera.position.y = 0
frontCamera.position.z = 3

const topCamera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 1, 2)
topCamera.position.x = 0
topCamera.position.y = 3
topCamera.position.z = 0
topCamera.lookAt(new THREE.Vector3())

const bottomCamera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 1, 2)
bottomCamera.position.x = 0
bottomCamera.position.y = -3
bottomCamera.position.z = 0
bottomCamera.lookAt(new THREE.Vector3())

const backCamera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 1, 2)
backCamera.position.x = 0
backCamera.position.y = 0
backCamera.position.z = -3
backCamera.lookAt(new THREE.Vector3())
backCamera.rotation.z = 0

const leftCamera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 1, 2)
leftCamera.position.x = -3
leftCamera.position.y = 0
leftCamera.position.z = 0
leftCamera.lookAt(new THREE.Vector3())
leftCamera.rotation.z = 0

const rightCamera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 1, 2)
rightCamera.position.x = 3
rightCamera.position.y = 0
rightCamera.position.z = 0
rightCamera.lookAt(new THREE.Vector3())
const cameraHelper = new THREE.CameraHelper(rightCamera)

const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color('white');
scene.background = envMap
scene.add(camera)
scene.add(frontCamera)
scene.add(topCamera)
scene.add(bottomCamera)
scene.add(backCamera)
scene.add(leftCamera)
scene.add(rightCamera)
scene.add(ambientLight)
scene.add(directionalLight)

// scene.add(cameraHelper)

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

const frontRenderer = new THREE.WebGLRenderer({ canvas: frontCanvas })
const topRenderer = new THREE.WebGLRenderer({ canvas: topCanvas })
const bottomRenderer = new THREE.WebGLRenderer({ canvas: bottomCanvas })
const backRenderer = new THREE.WebGLRenderer({ canvas: backCanvas })
const leftRenderer = new THREE.WebGLRenderer({ canvas: leftCanvas })
const rightRenderer = new THREE.WebGLRenderer({ canvas: rightCanvas })


const axesHelper = new THREE.AxesHelper(6)
    // scene.add(axesHelper)

const arrows = new THREE.Group()
arrows.name = "Arrows"

// const arrow = new Arrow3D(new THREE.Vector3(1.5, 1.5, 0))
// const arrow2 = new Arrow3D(new THREE.Vector3(1.5, 1.5, 0))
// arrows.add(arrow)
// arrow2.rotation.y -= Math.PI
// arrow2.rotation.z = Math.PI / 2
// arrows.add(arrow2)

// scene.add(arrows)


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
const rubiksCube = new RubiksCube(3, scene)

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

var hoveredArrows = {};

// https://stackoverflow.com/questions/55232295/mouseleave-in-three-js
function checkArrowHover(event) {

    event.preventDefault();
    const raycaster = new THREE.Raycaster();
    const mousePosition = new THREE.Vector2();
    const rect = renderer.domElement.getBoundingClientRect();

    mousePosition.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mousePosition.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    var intersects = raycaster.intersectObjects(rubiksCube.arrows, true);

    var hoveredArrowsUuids = intersects.map(el => el.object.parent.uuid);

    for (let i = 0; i < intersects.length; i++) {
        var hoveredObj = intersects[i].object.parent;
        if (hoveredArrows[hoveredObj.uuid]) {
            document.body.style.cursor = 'pointer'
            continue; // this object was hovered and still hovered
        }


        hoveredObj.highlight()

        // collect hovered object
        hoveredArrows[hoveredObj.uuid] = hoveredObj;
    }

    for (let uuid of Object.keys(hoveredArrows)) {
        let idx = hoveredArrowsUuids.indexOf(uuid);
        if (idx === -1) {
            // object with given uuid was unhovered
            let unhoveredObj = hoveredArrows[uuid];
            delete hoveredArrows[uuid];
            unhoveredObj.hide()
            document.body.style.cursor = 'default'

        }
    }

    if (intersects.length > 0) {
        intersects[0].object.parent.highlight();

    }
}

let currArrowClicked

function arrowClick(event) {

    event.preventDefault();
    const raycaster = new THREE.Raycaster();
    const mousePosition = new THREE.Vector2();
    const rect = renderer.domElement.getBoundingClientRect();

    mousePosition.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mousePosition.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    var intersects = raycaster.intersectObjects(rubiksCube.arrows, true);


    if (intersects.length > 0) {
        if (currArrowClicked == intersects[0].object && event.type == "pointerup") {
            intersects[0].object.parent.clicked(intersects[0].object, rubiksCube)
            currArrowClicked = null
        } else {
            currArrowClicked = intersects[0].object
        }
    }

}


//https://discourse.threejs.org/t/mousedown-event-is-not-getting-triggered/18685
renderer.domElement.addEventListener("pointerdown", arrowClick, true);
renderer.domElement.addEventListener("pointerup", arrowClick, true);
renderer.domElement.addEventListener("mousemove", checkArrowHover, true);

camera.lookAt(new THREE.Vector3(1, 1, 0))


/**
 * Animation
 */
function animate() {

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    frontRenderer.render(scene, frontCamera)
    topRenderer.render(scene, topCamera)
    bottomRenderer.render(scene, bottomCamera)
    backRenderer.render(scene, backCamera)
    leftRenderer.render(scene, leftCamera)
    rightRenderer.render(scene, rightCamera)
        // Call tick again on the next frame
    window.requestAnimationFrame(animate)

    // cube.cubeGroup.rotation.x += 0.005
    // cube.cubeGroup.rotation.y += 0.0025
}

animate()