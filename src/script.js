import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')
const matcapTextureText = textureLoader.load('textures/matcaps/3.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()
const arrayOfDonuts = []
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const materialText = new THREE.MeshMatcapMaterial({ matcap: matcapTextureText })

        // Text
        const textGeometry = new TextGeometry(
            'Testing Three.JS',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, materialText)
        scene.add(text)

        // Donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

        for(let i = 0; i < 1000; i++)
        {
            const donut = new THREE.Mesh(donutGeometry, material)
            donut.position.x = (Math.random() - 0.5) * 25
            donut.position.y = (Math.random() - 0.5) * 25
            donut.position.z = (Math.random() - 0.5) * 25
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            arrayOfDonuts.push(donut)

            scene.add(donut)
        }
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 8
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for(let i = 0; i< arrayOfDonuts.length; ++i) {
        arrayOfDonuts[i].rotation.x += Math.random() * Math.PI * 0.01
        arrayOfDonuts[i].rotation.y += Math.random() * Math.PI * 0.01
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()