import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

let fadeSpeed = 0.002;  // Control how fast particles fade
let moveSpeed = 0.01;   // Control how fast particles move

const tesseractVertices = [
    [-1, -1, -1, -1], [1, -1, -1, -1], [-1, 1, -1, -1], [1, 1, -1, -1],
    [-1, -1, 1, -1], [1, -1, 1, -1], [-1, 1, 1, -1], [1, 1, 1, -1],
    [-1, -1, -1, 1], [1, -1, -1, 1], [-1, 1, -1, 1], [1, 1, -1, 1],
    [-1, -1, 1, 1], [1, -1, 1, 1], [-1, 1, 1, 1], [1, 1, 1, 1]
];

function project4Dto3D(vertex) {
    const w = 2;
    const scale = w / (w + vertex[3]);
    return [
        vertex[0] * scale, 
        vertex[1] * scale, 
        vertex[2] * scale
    ];
}

function createTesseractGeometry() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const tesseractEdges = [
        [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7],
        [4, 5], [4, 6], [5, 7], [6, 7], [8, 9], [8, 10], [8, 12], [9, 11],
        [9, 13], [10, 11], [10, 14], [11, 15], [12, 13], [12, 14], [13, 15], [14, 15],
        [0, 8], [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15]
    ];

    tesseractEdges.forEach(edge => {
        const v1 = project4Dto3D(tesseractVertices[edge[0]]);
        const v2 = project4Dto3D(tesseractVertices[edge[1]]);

        vertices.push(...v1, ...v2);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
}

function initBackground(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const loader = new THREE.TextureLoader();
    const displacement = loader.load("./media/displace_map.jpg");
    const displacementRev = loader.load("./media/displace_map_rev.jpg");
    const alphaMap = loader.load("./media/alpha_map.jpg");
    const planeTexture = loader.load("./media/square.png");
    const particleTexture = loader.load('./assets/dot.png');
    const maincanvas = document.getElementById("maincanvas");
    maincanvas.style.height = window.outerHeight
    maincanvas.style.width = window.outerWidth

    const renderer = new THREE.WebGLRenderer({canvas: maincanvas});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const light = new THREE.AmbientLight( 0x787878 );
    scene.add( light );

    const tesseractGeometry = createTesseractGeometry();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry2 = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    const geometry3 = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
    const material = new THREE.MeshStandardMaterial({ 
        color: '#CF9FFF',
        normalMap: alphaMap,
        transparent: true
    });
    
    const spriteMaterial = new THREE.SpriteMaterial({
        map: particleTexture,
        color: 0xffffff,
        transparent: true,
        depthTest: true,
        depthWrite: false,
    });
    const spriteParticles = [];
    
    for (let i = 0; i < 500; i++) {
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        let random = getRandomArbitrary(0,0.2)
        sprite.scale.set(random, random, random);
        scene.add(sprite);
        spriteParticles.push(sprite);
    }

    const cube = new THREE.Mesh(geometry, material);
    const cube2 = new THREE.Mesh(geometry2, material);
    const cube3 = new THREE.Mesh(geometry3, material);
    cube3.position.y -= 0.4;
    cube2.position.y += 0.6;
    cube.position.y += 2;
    scene.add(cube, cube2, cube3);

    const planegeo = new THREE.PlaneGeometry(24, 24, 1024, 1024);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotateSpeed = 0.5;
    orbitControls.autoRotate = true;

    const planemat = new THREE.MeshStandardMaterial({
        color: '#CF9FFF',
        map: planeTexture,
        displacementMap: displacement,
        alphaMap: alphaMap,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        alphaTest: 0.005
    });

    const planemat2 = new THREE.MeshStandardMaterial({
        color: '#CF9FFF',
        map: planeTexture,
        displacementMap: displacementRev,
        alphaMap: alphaMap,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        alphaTest: 0.005
    });

    const tesseractMaterial = new THREE.LineBasicMaterial({ color: 0xCF9FFF });
    const tesseract = new THREE.LineSegments(tesseractGeometry, tesseractMaterial);
    tesseract.position.y += 2;
    scene.add(tesseract);

    tesseract.scale.set(0.25, 0.25, 0.25);

    planemat.displacementScale = 3;
    planemat2.displacementScale = -3;

    const plane = new THREE.Mesh(planegeo, planemat);
    plane.rotation.x = -(Math.PI / 2);
    plane.position.y = -4;
    plane.renderOrder = 1;
    scene.add(plane);

    const plane2 = new THREE.Mesh(planegeo, planemat2);
    plane2.rotation.x = (Math.PI / 2);
    plane2.position.y = -4;
    plane2.renderOrder = 1;
    scene.add(plane2);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const unrealBloomPass = new UnrealBloomPass();
    unrealBloomPass.bloomThreshold = 0.14;
    composer.addPass(unrealBloomPass);

    camera.position.z = 10;

    let resized = false;
    window.addEventListener('resize', function() {
        resized = true;
    });

    function resize() {
        resized = false;
        renderer.setSize(window.innerWidth, window.innerHeight);
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    function animate() {
        if (resized) resize();
        requestAnimationFrame(animate);

        spriteParticles.forEach(sprite => {
            sprite.position.y -= 0.01;
            if (sprite.position.y < -25) sprite.position.y = 25;

            let closestObject = null;
            let minDistance = Infinity;

            [cube, cube2, cube3, plane, plane2].forEach(mesh => {
                const distance = sprite.position.distanceTo(mesh.position);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestObject = mesh;
                }
            });

            if (closestObject) {
                const color = closestObject.material.color;
                sprite.material.color.set(color);
            }
        });

        tesseract.rotation.x -= 0.001;
        tesseract.rotation.y -= 0.001;
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;
        cube2.rotation.x -= 0.001;
        cube2.rotation.y -= 0.001;
        cube3.rotation.x += 0.001;
        cube3.rotation.y += 0.001;

        composer.render(scene, camera);
        orbitControls.update();
    }

    animate();
}
initBackground();
