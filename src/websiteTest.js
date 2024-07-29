import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/Addons.js'

// Window Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Basic Initializations
const canvas = document.querySelector('canvas.webGLWebsite')
const scene = new THREE.Scene()
const cameraGroup = new THREE.Group()
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height)
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

camera.position.z = 3
cameraGroup.add(camera)
scene.add(cameraGroup)

// Loadings
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/particles/1.png')
const gradientTexture = textureLoader.load('/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter


// Mesh
const commonMaterial = new THREE.MeshToonMaterial({ color: "White", gradientMap: gradientTexture })

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 25, 25)
const cubeMaterial = new THREE.MeshMatcapMaterial({ color: "Gold" })
const cube = new THREE.Mesh(cubeGeometry, commonMaterial)
const cube2 = new THREE.Mesh(cubeGeometry, commonMaterial)

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.65, 0.25, 100, 100)
const torusKnotMaterial = new THREE.MeshMatcapMaterial({ color: "Gold" })
const torusKnot = new THREE.Mesh(torusKnotGeometry, commonMaterial)
const torusKnot2 = new THREE.Mesh(torusKnotGeometry, commonMaterial)

const torusGeometry = new THREE.TorusGeometry(0.65, 0.35, 25, 25)
const torusMaterial = new THREE.MeshMatcapMaterial({ color: "Gold" })
const torus = new THREE.Mesh(torusGeometry, commonMaterial)
const torus2 = new THREE.Mesh(torusGeometry, commonMaterial)

scene.add(cube)
scene.add(torusKnot)
scene.add(torus)
scene.add(cube2)
scene.add(torusKnot2)
scene.add(torus2)

const meshAvailable = [torusKnot, cube, torus, torusKnot2, cube2, torus2]

const meshDistance = 3

//Mesh Transformations
for (let meshIndex = 0; meshIndex < meshAvailable.length; meshIndex++) {
    meshAvailable[meshIndex].position.y = - (meshIndex * meshDistance);
    meshAvailable[meshIndex].position.x = meshIndex % 2 ? -1.5 : 1.5
    // console.log(meshIndex % 2 ? -1 : 1)
}

//Lights
const directionalLights = new THREE.DirectionalLight()
directionalLights.position.set(1, 1, 1)
scene.add(directionalLights)


//Particle System

const particleCount = 1000

const particleGeometry = new THREE.BufferGeometry()
// const particleMaterial = new THREE.MeshMatcapMaterial()

const particlePoints = new Float32Array(particleCount * 3)
const particleSpaceMultiplyingFactor = 3

console.log(meshAvailable.length + 1)
for (let i = 0; i < particleCount; i++) {

    let i3 = i * 3
    particlePoints[i3 + 0] = (Math.random() - 0.5) * (meshAvailable.length * meshDistance) * particleSpaceMultiplyingFactor
    particlePoints[i3 + 1] = - (Math.random() - 0.4) * ((meshAvailable.length * meshDistance) + (meshAvailable.length * meshAvailable.length)) * particleSpaceMultiplyingFactor / 2
    particlePoints[i3 + 2] = (Math.random() - 0.5) * (meshAvailable.length * meshDistance) * particleSpaceMultiplyingFactor
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePoints, 3))
const particleMaterial = new THREE.PointsMaterial()
particleMaterial.size = 0.05
particleMaterial.sizeAttenuation = true
particleMaterial.transparent = true
particleMaterial.alphaMap = particleTexture
particleMaterial.depthWrite = false
particleMaterial.blending = THREE.AdditiveBlending

const particles = new THREE.Points(particleGeometry, particleMaterial)

scene.add(particles)



// Window Resize Handler
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth,
        sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Window WebGL Camera Scroll
window.addEventListener('scroll', () => {
    const scroll = {
        X: window.scrollX,
        Y: - window.scrollY
    }
    // console.log('scroll')
    // console.log(window.scrollY)
    // console.log(scroll.scrollX)
    camera.position.x = scroll.X / sizes.width * meshDistance
    // console.log(camera.position.x)
    camera.position.y = scroll.Y / sizes.height * meshDistance

})

const cursorPositions = {
    X: 0,
    Y: 0
}

window.addEventListener('mousemove', (event) => {
    cursorPositions.X = event.clientX / sizes.width - 0.5,
        cursorPositions.Y = event.clientY / sizes.height - 0.5
}
    // console.log(cursorPositions.X,cursorPositions.Y);
)

// Controls
// const controls = new OrbitControls(camera,canvas)
// controls.enableDamping=true


// renderer.setClearColor('gray')
renderer.setClearAlpha(0.001)

const clock = new THREE.Clock()
let previousTime = 0

// Tick
const tick = () => {

    // controls.update()

    let elpasedTime = clock.getElapsedTime()
    let deltaTime = elpasedTime - previousTime
    previousTime = elpasedTime

    const parallaxX = cursorPositions.X * 0.5
    const parallaxY = - cursorPositions.Y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime

    for (const mesh of meshAvailable) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)

}

tick()
