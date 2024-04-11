import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/*
SETUP
*/

//Sizes
const sizes = {
    width: window.innerWidth / 2.5,
    height: window.innerWidth / 2.5,
    aspectRatio: 1
}

/*
SCENE
*/

//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(0, 0, 20)
scene.add(camera)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

//Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*
LIGHTS
*/

//Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/*
MESHES
*/

//Cube Geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

//Cube Materials
const orangeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('orange')
})
const purpleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('purple')
})
const cyanMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('cyan')
})

const drawCube = (i, material) =>
{
    const cube = new THREE.Mesh(cubeGeometry, material)
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = i - 10

    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI

    scene.add(cube)
}


/*
TEXT PARSERS & UI
*/

let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'gatsby',
    term2: 'daisy',
    term3: 'george',
    rotateCamera: false
}

//Text Parsers

//Parse Text & Terms
const parseTextandTerms = () =>
{
    //Strip Periods & Downcase Text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()

    //Tokenize Text
    uiobj.textArray = parsedText.split(/[^\w']+/)

    //Find Term 1
    findTermInParsedText(uiobj.term1, orangeMaterial)

    //Find Term 2
    findTermInParsedText(uiobj.term2, purpleMaterial)

    //Find Term 3
    findTermInParsedText(uiobj.term3, cyanMaterial)

}

const findTermInParsedText = (term, material) =>
{
    for (let i=0; i < uiobj.textArray.length; i++)
    {
        if(uiobj.textArray[i] === term)
        {
         const n = (100 / uiobj.textArray.length) * i * 0.2
         
         for(let a=0; a < 5; a++)
         {
            drawCube(n, material)
         }

        }
    }
}

//Load Source Text
fetch("https://raw.githubusercontent.com/K2HRS/IASC-2P02/main/assignment2/assets/gatsby.txt")
    .then(response => response.text())
    .then((data) =>
    {
        uiobj.text = data
        parseTextandTerms()
    }
    )

//UI
const ui = new dat.GUI({
    container: document.querySelector('#parent1')
})

//Interaction Folders
    //Cubes Folder
    const cubesFolder = ui.addFolder('Filter Terms')

    cubesFolder
        .add(orangeMaterial, 'visible')
        .name(`${uiobj.term1}`)

    cubesFolder
        .add(purpleMaterial, 'visible')
        .name(`${uiobj.term2}`)

    cubesFolder
        .add(cyanMaterial, 'visible')
        .name(`${uiobj.term3}`)

    //Camera Folder
    const cameraFolder = ui.addFolder('Camera')

    cameraFolder
        .add(uiobj, 'rotateCamera')
        .name('Rotate Camera')

/*
ANIMATION LOOP 
*/

const clock = new THREE.Clock()
console.log(scene.children)

//Animate
const animation = () =>
{
    //Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    //Orbit Controls
    controls.update()

    //Camera Rotation
    if(uiobj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.2) * 16
        camera.position.z = Math.cos(elapsedTime * 0.2) * 16
    }
    
    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation()