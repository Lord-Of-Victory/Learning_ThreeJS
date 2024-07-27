import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'

//Debug
const gui = new GUI()

const canvas= document.querySelector('canvas.webgl')
const scene = new THREE.Scene()


//Texture
const loadManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadManager)
const colorTexture = textureLoader.load('/Color.png')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')

const textMaterial = new THREE.MeshStandardMaterial({color:'#ff8800'})
textMaterial.roughness=1


//Lights
const ambientLight = new THREE.AmbientLight('white',2)
const pointLight = new THREE.PointLight('white',100)
// const pointLightHelper = new THREE.PointLightHelper(pointLight)
const pointLight2 = new THREE.PointLight('white',2)
// const pointLightHelper2 = new THREE.PointLightHelper(pointLight2)
pointLight.position.set(5,5,5)
pointLight2.position.set(0,0,1)
scene.add(ambientLight)
scene.add(pointLight)
scene.add(pointLight2)
// scene.add(pointLightHelper)
// scene.add(pointLightHelper2)

const spotLight = new THREE.SpotLight('white',25)
spotLight.position.set(-1.7,1.1,0.08)
scene.add(spotLight)
// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)



// //Environment
// const envMaterial = new THREE.MeshBasicMaterial({color: '#61f4ff'})
// envMaterial.side = THREE.DoubleSide
// const envGeometry = new THREE.SphereGeometry(10,50,50)
// // const envPointsMaterial = new THREE.PointsMaterial({color:'white',wireframe:true}) // Not Figured Out
// // envPointsMaterial.side = THREE.DoubleSide //Not Figured Out
// const envMesh = new THREE.Mesh(envGeometry,envMaterial)
// scene.add(envMesh)

//Font
const worldText = new THREE.Mesh()
const fontLoader = new FontLoader(loadManager)
fontLoader.load('/fonts/gentilis_regular.typeface.json',(font)=>{
    const textGeometry = new TextGeometry("Donuts",
        {
            font:font,
            size:0.5,
            depth:0.2,
            curveSegments:12,
            bevelEnabled:true,
            bevelSegments:15,
            bevelSize:0.04,
            bevelThickness:0.04,
            bevelOffset:0,
        }
    )
    
    textGeometry.center()
    worldText.geometry = textGeometry
    worldText.material = textMaterial
    scene.add(worldText)
    
})


//Donut

const donutGroup = new THREE.Group()
scene.add(donutGroup)


const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
const donutMaterialPink = new THREE.MeshStandardMaterial({color:'#fb8383'})
const donutMaterialChocolate = new THREE.MeshStandardMaterial({color:'#533123'})
const donutMaterialVanilla = new THREE.MeshStandardMaterial({color:'#fdbf77'})
donutMaterialPink.roughness=0.5
donutMaterialChocolate.roughness=0.5
donutMaterialVanilla.roughness=0.5

const donutMaterialList = [donutMaterialPink,donutMaterialVanilla]

for (let inst = 0; inst < 750; inst++) {
    const choice = Math.round((Math.random() * 1))
    const donut = new THREE.Mesh(donutGeometry,donutMaterialList[choice])
    donutGroup.add(donut)
    
    donut.position.x= (Math.random()-0.5) * 20
    donut.position.y= (Math.random()-0.5) * 20
    donut.position.z= (Math.random()-0.5) * 20

    donut.rotation.x=Math.random() * Math.PI
    donut.rotation.y=Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale,scale,scale)
}

// const geometry = new THREE.BoxGeometry(1,1,1)
// const material = new THREE.MeshBasicMaterial({map:colorTexture})
// const normalMaterial = new THREE.MeshNormalMaterial({bumpMap: normalTexture})

// const mesh = new THREE.Mesh(geometry,material)

// scene.add(mesh)

const sizes={
    width:window.innerWidth,
    height:window.innerHeight,
}

const cursor={
    x:0,
    y:0,
}

const camera = new THREE.PerspectiveCamera(55,sizes.width/sizes.height)

scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})

camera.position.z = 2
// camera.position.y = 2
// camera.rotation.z=2
// camera.rotation.y=1
// camera.rotation.x=1

// camera.lookAt(mesh.position)
// spotLight.lookAt(worldText)


/// Controls
const orbitControls = new OrbitControls(camera,canvas)
orbitControls.enableDamping=true
// const mapControls = new MapControls(camera,canvas)
// const flyControls = new FlyControls(camera,canvas)


window.addEventListener('mousemove',(event)=>{
    cursor.x = event.clientX * sizes.width - 0.5
    cursor.y = -1 * (event.clienY * sizes.width - 0.5)
})

renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

const clock = new THREE.Clock

//Box Tweaks
// const guiBoxFolder = gui.addFolder('Box Tweaks')
// guiBoxFolder.add(mesh.position,'y', -3, 3, 0.01).name("Elevation")
// guiBoxFolder.add(mesh,'visible').name("Visibility")
// guiBoxFolder.add(material,'wireframe').name("Wireframe")
// guiBoxFolder.addColor(material,'color').name("Color")
// const parameters={
//     spin:()=>{
//         gsap.to(mesh.rotation,{duration:1, y: mesh.rotation.y + 1})
//         }
// }
// guiBoxFolder.add(parameters,"spin")


//lightGUI
const guiSpotLightFolder = gui.addFolder('SpotLights')
guiSpotLightFolder.add(spotLight,'visible').name('SpotLight')
// // guiSpotLightFolder.add(spotLightHelper,'visible').name('spotLightHelper')
guiSpotLightFolder.add(spotLight,'intensity',0,50,1).name('SpotLight Intensity')
guiSpotLightFolder.add(spotLight.position,'x',-10,10).name('SpotLight pos X')
guiSpotLightFolder.add(spotLight.position,'y',-10,10).name('SpotLight pos Y')
guiSpotLightFolder.add(spotLight.position,'z',-10,10).name('SpotLight pos Z')

const guiPointLightFolder = gui.addFolder('PointLights')
guiPointLightFolder.add(pointLight,'visible').name('PointLight 1')
guiPointLightFolder.add(pointLight,'intensity',0,100,1).name('PointLight 1 Intensity')
guiPointLightFolder.add(pointLight2,'visible').name('PointLight 2')
guiPointLightFolder.add(pointLight2,'intensity',0,100,1).name('PointLight 2 Intensity')



window.addEventListener('resize',()=>{
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight
    
    camera.aspect=sizes.width/sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width,sizes.height)
})

// window.addEventListener('dblclick',()=>{
//     if (!document.fullscreenElement) {
//         canvas.requestFullscreen()  
//     } else {
//         document.exitFullscreen()
//     }
// })



//Fog
const fog = new THREE.Fog('#61f4ff',2,15)
scene.fog=fog

const guiFogFolder = gui.addFolder('Fog')
guiFogFolder.add(fog,'near',-5,10,1).name('Fog Near')
guiFogFolder.add(fog,'far',0,50,1).name('Fog Far')

renderer.setClearColor(new THREE.Color('#61f4ff'))

// console.log(donutGroup.children)

const tick = () =>{
    
    // console.log(clock.getElapsedTime())
    orbitControls.update()
    // pointLightHelper.update()
    // pointLightHelper2.update()
    // spotLightHelper.update()

    donutGroup.children.forEach(donut => {
        donut.rotation.x+=(0.02 * Math.random() )* Math.random()
    });

    window.requestAnimationFrame(tick)
    renderer.render(scene,camera)
}



tick()
