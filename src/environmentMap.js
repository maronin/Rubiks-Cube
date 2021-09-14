import * as THREE from 'three'
const cubeTextureLoader = new THREE.CubeTextureLoader()
export default cubeTextureLoader.load([
    './textures/environmentMaps/colorful studio/px.png',
    './textures/environmentMaps/colorful studio/nx.png',
    './textures/environmentMaps/colorful studio/py.png',
    './textures/environmentMaps/colorful studio/ny.png',
    './textures/environmentMaps/colorful studio/pz.png',
    './textures/environmentMaps/colorful studio/nz.png',
])