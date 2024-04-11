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
const canvas = document.querySelector('.webgl2')

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

//Sphere Geometry
const sphereGeometry = new THREE.SphereGeometry(0.5)

//Sphere Materials
const redMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('red')
})
const limeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('lime')
})
const violetMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('violet')
})

const drawSphere = (i, material) =>
{
    const sphere = new THREE.Mesh(sphereGeometry, material)
    sphere.position.x = (Math.random() - 0.5) * 10
    sphere.position.z = (Math.random() - 0.5) * 10
    sphere.position.y = i - 10

    sphere.rotation.x = Math.random() * 2 * Math.PI
    sphere.rotation.y = Math.random() * 2 * Math.PI
    sphere.rotation.z = Math.random() * 2 * Math.PI

    sphere.randomizer = Math.random()

    scene.add(sphere)
}


/*
TEXT PARSERS & UI
*/

let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'party',
    term2: 'pool',
    term3: 'ashes',
    rotateCamera: false,
    animateObjects: false
}

//Text Parsers
//Parse Text and Terms
const parseTextandTerms = () =>
{
    //Strip Periods & Downcase Text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
    //console.log(parsedText)

    //Tokenize Text
    uiobj.textArray = parsedText.split(/[^\w']+/)
    //console.log(uiobj.textArray)

    //Find Term 1
    findTermInParsedText(uiobj.term1, redMaterial)

    //Find Term 2
    findTermInParsedText(uiobj.term2, limeMaterial)

    //Find Term 3
    findTermInParsedText(uiobj.term3, violetMaterial)

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
            drawSphere(n, material)
         }

        }
    }
}

//Load source text

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
    container: document.querySelector('#parent2')
})

//Interaction Folders
    //Spheres Folder
    const spheresFolder = ui.addFolder('Filter Terms')

    spheresFolder
        .add(redMaterial, 'visible')
        .name(`${uiobj.term1}`)

    spheresFolder
        .add(limeMaterial, 'visible')
        .name(`${uiobj.term2}`)

    spheresFolder
        .add(violetMaterial, 'visible')
        .name(`${uiobj.term3}`)

    spheresFolder
        .add(uiobj, 'animateObjects')
        .name('Animate Objects')

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

    //Animate Objects
    if(uiobj.animateObjects){
        for(let i=0; i < scene.children.length; i++)
        {
            if(scene.children[i].type === "Mesh")
            {
                scene.children[i].rotation.x = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].rotation.z = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].scale.y = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].scale.z = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].position.x = Math.sin(elapsedTime * scene.children[i].randomizer)
            }
        }
    }

    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation()