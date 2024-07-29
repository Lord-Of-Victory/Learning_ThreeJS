import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// Window Sizes
const sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}

//Basic Initializations
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)
const renderer = new THREE.WebGLRenderer({canvas:canvas})
renderer.setSize(sizes.width,sizes.height)

camera.position.z = 2
scene.add(camera)

// Loadings
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/particles/1.png')


// Mesh
const cubeGeometry = new THREE.BoxGeometry(1,1,1,25,25)
const cubeMaterial = new THREE.MeshMatcapMaterial({color:"Gold"})
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
scene.add(cube)




//Particle System

const particleCount = 5000

const particleGeometry = new THREE.BufferGeometry()
// const particleMaterial = new THREE.MeshMatcapMaterial()

const particlePoints = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount*3; i++) {
    particlePoints[i]=(Math.random() -0.5)*5
}

particleGeometry.setAttribute('position',new THREE.BufferAttribute(particlePoints, 3))
const particleMaterial = new THREE.PointsMaterial()
particleMaterial.size=0.05
particleMaterial.sizeAttenuation=true
particleMaterial.transparent=true
particleMaterial.alphaMap=particleTexture
particleMaterial.depthWrite=false
particleMaterial.blending = THREE.AdditiveBlending

const particles = new THREE.Points(particleGeometry,particleMaterial)

scene.add(particles)



// Window Resize Handler
window.addEventListener('resize',()=>{
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight

    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width,sizes.height)
})

// Controls
const controls = new OrbitControls(camera,canvas)
controls.enableDamping=true

// Tick
const tick = ()=>{
    
    controls.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)

}

tick()
