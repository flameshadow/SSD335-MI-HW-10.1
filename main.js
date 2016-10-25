/**
 * Created by mark on 10/20/16.
 */

Physijs.scripts.worker = 'lib/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

document.addEventListener("DOMContentLoaded", onLoad);

var renderer, camera, scene, controls;
var bowl;
const tossScale = 50;

function onLoad() {

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    window.addEventListener('resize', onWindowResize, false);
    sceneSetup();
    initialDraw();
    makeCubes();
    animate();
}

var isDown = false; // whether mouse is pressed
var startCoords = []; // 'grab' coordinates when pressing mouse
var last = [0, 0]; // previous coordinates of mouse release

function onMouseDown(e) {
    isDown = true;

    startCoords = [
        e.offsetX , // set start coordinates
        e.offsetY
    ];
}

function onMouseUp(e) {
    isDown = false;

    last = [
        e.offsetX - startCoords[0], // set last coordinates
        e.offsetY - startCoords[1]
    ];
    var impulseX = (last[0] / screen.width)*tossScale;
    var impulseY = Math.abs((last[1] / screen.height)*tossScale); // toss it upwards only
    tossCubes(impulseX, impulseY);
//    console.log('iX: ' + impulseX + ' iY' + impulseY);
//    console.log(last);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function sceneSetup() {
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 60);

    scene = new Physijs.Scene({reportSize: 30, fixedTimeStep:1/120});
    scene.setGravity(new THREE.Vector3(0, -10, 0));
    scene.add(camera);

    var light = new THREE.PointLight(0xa0a0a0, 0.5, 0);
    light.position.set(50, 70, 100);
    scene.add(light);

    light = new THREE.AmbientLight(0x808080, 1);
    scene.add(light);
    // controls = new THREE.TrackballControls(camera, renderer.domElement);
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;
    // controls.noZoom = false;
    // controls.noPan = true;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.3;
    // controls.target = scene.position;
} // function sceneSetup()

function createSphereMesh(radius, segments, material) {
    var geometry = new THREE.SphereGeometry(radius, segments, segments);
    return new Physijs.ConcaveMesh(
        geometry,
        material,
        0 // mass
    );
} // function createSphereMesh()

function initialDraw() {

    // Create inner sphere
    var material = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0 });
    scene.add(createSphereMesh(6.9, 32, material));

    // Create outer sphere
    material = new THREE.MeshPhongMaterial( {
        color:0x909090,
        //emissive: 0x443311,
        specular: 0x0000F0,
        opacity:.5,
        transparent:true,
        side: THREE.DoubleSide, // important
        shading: THREE.SmoothShading
    });

    scene.add(createSphereMesh(7, 32, material));
} // function initialDraw()


var cubeArray = [];
function makeCubes() {
    for (var i = 0; i < 30; i++) {
        var box1=new Physijs.BoxMesh(
            new THREE.CubeGeometry(0.5, 0.5, 0.5),
            new THREE.MeshNormalMaterial(),
            1.0
        );
        box1.position.set(Math.random()*5-2.5, Math.random()*5-2.5, Math.random()*5-2.5);
        scene.add(box1);
        cubeArray.push(box1);
    } // for i
} // function makeCubes()

function tossCubes(xImpulse, yImpulse) {
    for (var i = 0; i < cubeArray.length; i++) {
        cubeArray[i].applyCentralImpulse(new THREE.Vector3(xImpulse, yImpulse, 0));
    } // for i
} // function tossCubes()

function animate() {
 //   controls.update();
    //  testCollisions();
    scene.simulate();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
} // function animate()
