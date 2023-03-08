import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

function initBackground(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const loader = new THREE.TextureLoader();
    const displacement = loader.load("displace_map.jpg");
    const displacementRev = loader.load("displace_map_rev.jpg");
    const alphaMap = loader.load("alpha_map.jpg");
    const planeTexture = loader.load("square.png");

    const renderer = new THREE.WebGLRenderer({canvas: maincanvas});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const light = new THREE.AmbientLight( 0xfffffff ); // soft white light
    scene.add( light );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial({ 
        color: '#03c6fc',
        normalMap: alphaMap,
        transparent: true
    });

    const cube = new THREE.Mesh( geometry, material );
    cube.position.y += 2;

    scene.add( cube );

    const planegeo = new THREE.PlaneGeometry(24, 24, 1024, 1024);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    
    orbitControls.autoRotateSpeed = 0.5;
    orbitControls.autoRotate = true;

    const planemat = new THREE.MeshStandardMaterial({
        color: '#03c6fc',
        map: planeTexture,
        displacementMap: displacement,
        alphaMap: alphaMap,
        transparent: true
    });

    const planemat2 = new THREE.MeshStandardMaterial({
        color: '#03c6fc',
        map: planeTexture,
        displacementMap: displacementRev,
        alphaMap: alphaMap,
        transparent: true
    });

    planemat.displacementScale = 3
    planemat2.displacementScale = -3

    const plane = new THREE.Mesh(planegeo, planemat);
    plane.rotation.x = -(Math.PI/2);
    plane.position.y =- 4;
    scene.add(plane);

    const plane2 = new THREE.Mesh(planegeo, planemat2);
    plane2.rotation.x = (Math.PI/2);
    plane2.position.y =- 4;
    scene.add(plane2);

    var composer = new EffectComposer(renderer);

    var renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    var unrealBloomPass = new UnrealBloomPass();
    composer.addPass(unrealBloomPass);

    camera.position.z = 10;

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    let resized = false

    window.addEventListener('resize', function() {
        resized = true
    })

    function resize() {
        resized = false
    
        renderer.setSize(window.innerWidth, window.innerHeight)
    
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth/canvas.clientHeight
        camera.updateProjectionMatrix()
    }

    function animate() {
        if (resized) resize()
        orbitControls.update()
        requestAnimationFrame( animate );
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;
        composer.render( scene, camera );
    }
    animate();

}
initBackground();