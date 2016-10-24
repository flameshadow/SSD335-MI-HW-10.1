/**
 * Created by mark on 10/20/16.
 */

Physijs.scripts.worker = 'lib/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

document.addEventListener("DOMContentLoaded", onLoad);

var renderer, camera, scene, controls;
var bowl;

const LARROW = 37;
const UARROW = 38;
const RARROW = 39;
const DARROW = 40;

function onLoad() {
    document.addEventListener("keydown", useKeyDown);
    window.addEventListener('resize', onWindowResize, false);
    sceneSetup();
    initialDraw();
    makeCubes();
    animate();
}

function useKeyDown(event) {
    console.log(event.keyCode);
    switch(event.keyCode) {
        case LARROW:
            break;
        case RARROW:
            break;
        case UARROW:
            tossCubes();
            break;
        case DARROW:
            bowl.rotation.x += 0.1;
            bowl.__dirtyRotation = true;
            break;
    } // switch
} // function useKeyDown()

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

    scene = new Physijs.Scene({reportSize: 2, fixeTimeStep:1/120});
    scene.setGravity(new THREE.Vector3(0, -10, 0));
    scene.add(camera);

    var light = new THREE.PointLight(0xFFFFFF, 4, 0);
    light.position.set(50, 70, 100);
    scene.add(light);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.target = scene.position;
} // function sceneSetup()

function initialDraw() {
    // make a progmamtic curve
    var curve = new THREE.EllipseCurve(
        0, 0, // start x and y
        7, 7, // radius on x and radius on y. These are equal because I am making a circle
        0, Math.PI/2, // Start at 0 and go 45 degrees. Could start at any angle.
        false           // Clockwise = true. Counterclockwise = false; Using CCW
    );

    var precision = 30;
    var points = curve.getSpacedPoints(precision/2); // get xx points along the curve

    // begin lathe settings

    var segments = precision;

    var phiStart = 0; // start angle of lathe at 0
    var phiLength = Math.PI*2; // end angle of lathe *full circle*
    // end lathe settings

    // take the points from the quarter circle curve, then lathe with settings above.
    var geometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
  //  geometry = new THREE.SphereGeometry(7, 30, 30, 0, Math.PI*2, 0, Math.PI);
    var material = new THREE.MeshPhongMaterial( {
        color:0x1133AA,
        emissive: 0x443311,
        opacity:0.5,
        transparent:true,
        side: THREE.DoubleSide, // important
        shading: THREE.FlatShading
    });

    var bowlBottom = new Physijs.ConcaveMesh(geometry, material);
    bowlBottom.rotation.x = Math.PI;
   // bowlBottom.rotation.y = Math.PI/2;
    bowlBottom.mass = 0;
    bowl = new Physijs.ConcaveMesh(geometry, material);
    bowl.mass = 0;
    bowl.rotation.x = -Math.PI/2;
  //  bowl.add(bowlBottom);
  //  scene.add(bowl);

    material = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0 });
    geometry = new THREE.SphereGeometry(6.5, 30, 30, 0, Math.PI*2, 0, Math.PI/2);
    var innerBowl = new Physijs.ConcaveMesh(geometry, material);
    innerBowl.mass = 0;
    scene.add(innerBowl);
} // function initialDraw()


var cubeArray = [];
function makeCubes() {
    for (var i = 0; i < 30; i++) {
        var box1=new Physijs.BoxMesh(
            new THREE.CubeGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({color: 0xFF0000}),
            1.0
        );
        box1.position.set(Math.random()*5-2.5, Math.random()*5-2.5, Math.random()*5-2.5);
        scene.add(box1);
        cubeArray.push(box1);
    }
}

function tossCubes() {
    for (var i = 0; i < cubeArray.length; i++) {
        cubeArray[i].applyCentralImpulse(new THREE.Vector3(0, 20, 0));
    }
}
function animate() {
    controls.update();
    //  testCollisions();
    scene.simulate();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
} // function animate()
