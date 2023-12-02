var container, scene, renderer, camera, light, ball, plane, autoSpawnInteval, autoSpawnIntevalEnabled = false;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;
let box1Wall1, box1Wall2, box1Wall3, box1Wall4;
let box2Wall1, box2Wall2, box2Wall3, box2Wall4;
const spikes = [];
var clock = new THREE.Clock();

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

container = document.querySelector('.viewport');

WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 1,
    FAR = 10000;

scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3(0, -50, 0));
scene.addEventListener('update', function () {
    scene.simulate(undefined, 2);
});

renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMapType = THREE.PCFShadowMap;
renderer.shadowMapAutoUpdate = true;
renderer.setClearColor(new THREE.Color(0xEEEEEE));

container.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

camera.position.set(70, 70, 130);
camera.lookAt(scene.position);
scene.add(camera);


light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 100, 60);
light.castShadow = true;
light.shadowCameraLeft = -60;
light.shadowCameraTop = -60;
light.shadowCameraRight = 60;
light.shadowCameraBottom = 60;
light.shadowCameraNear = 1;
light.shadowCameraFar = 1000;
light.shadowBias = -.0001
light.shadowMapWidth = light.shadowMapHeight = 1024;
light.shadowDarkness = .7;

scene.add(light);


// OBJECTS

// PLANE
(function createPlane() {
    plane = new Physijs.BoxMesh(
        new THREE.CubeGeometry(100, 2, 100, 10, 10),
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x9191ff
            }),
            .4,
            .99
        ),
        0
    );
    plane.receiveShadow = true;
    scene.add(plane);
}());

// BOX1
(function createBox() {
    const boxGeometry1 = new THREE.CubeGeometry(2, 20, 100, 1, 1);
    const boxGeometry2 = new THREE.CubeGeometry(100, 20, 2, 1, 1);

    const box1Wall1 = new Physijs.BoxMesh(
        boxGeometry1,
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x0000ee,
                transparent: true,
                opacity: 0.2
            }),
            .4,
            .99
        ),
        0
    );
    box1Wall1.position.y = 4;
    box1Wall1.position.x = -49;
    box1Wall1.receiveShadow = true;
    scene.add(box1Wall1);

    const box1Wall2 = new Physijs.BoxMesh(
        boxGeometry1,
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x0000ee,
                transparent: true,
                opacity: 0.2
            }),
            .4,
            .99
        ),
        0
    );
    box1Wall2.position.y = 4;
    box1Wall2.position.x = 49;
    box1Wall2.receiveShadow = true;
    scene.add(box1Wall2);

    const box1Wall3 = new Physijs.BoxMesh(
        boxGeometry2,
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x0000ee,
                transparent: true,
                opacity: 0.2
            }),
            .4,
            .99
        ),
        0
    );
    box1Wall3.position.y = 4;
    box1Wall3.position.z = -49;
    box1Wall3.receiveShadow = true;
    scene.add(box1Wall3);

    const box1Wall4 = new Physijs.BoxMesh(
        boxGeometry2,
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x0000ee,
                transparent: true,
                opacity: 0.2
            }),
            .4,
            .99
        ),
        0
    );
    box1Wall4.position.y = 4;
    box1Wall4.position.z = 49;
    box1Wall4.receiveShadow = true;
    scene.add(box1Wall4);
}());

// BOX2
(function createBox() {
    const boxGeometry1 = new THREE.CubeGeometry(2, 20, 30, 1, 1);
    const boxGeometry2 = new THREE.CubeGeometry(30, 20, 2, 1, 1);
    const box2Wall1 = new Physijs.BoxMesh(
        boxGeometry1,
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x0000ee,
                transparent: true,
                opacity: 0.2
            }),
            .4,
            .99
        ),
        0
    );
    box2Wall1.position.y = 10;
    box2Wall1.position.x = -14;
    box2Wall1.receiveShadow = true;
    scene.add(box2Wall1);

    const box2Wall2 = new Physijs.BoxMesh(
        boxGeometry1,
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x0000ee,
                transparent: true,
                opacity: 0.2
            }),
            .4,
            .99
        ),
        0
    );
    box2Wall2.position.y = 10;
    box2Wall2.position.x = 14;
    box2Wall2.receiveShadow = true;
    scene.add(box2Wall2);

    const box2Wall3 = new Physijs.BoxMesh(
        boxGeometry2,
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x0000ee,
                transparent: true,
                opacity: 0.2
            }),
            .4,
            .99
        ),
        0
    );
    box2Wall3.position.y = 10;
    box2Wall3.position.z = -14;
    box2Wall3.receiveShadow = true;
    scene.add(box2Wall3);

    const box2Wall4 = new Physijs.BoxMesh(
        boxGeometry2,
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x0000ee,
                transparent: true,
                opacity: 0.2
            }),
            .4,
            .99
        ),
        0
    );
    box2Wall4.position.y = 10;
    box2Wall4.position.z = 14;
    box2Wall4.receiveShadow = true;
    scene.add(box2Wall4);
}());

// SPIKES
(function createSpikes() {
    // SPIKES
    const spikeGeometry = new THREE.ConeGeometry(5, 10, 4);
    const spikeMaterial = new THREE.MeshLambertMaterial({
        color: 0x4c4cfc
    });
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (i > 2 && i < 7 && j > 2 && j < 7 || (j == 0 || i == 0 || j == 9 || i == 9)) {
                continue;
            }
            const spike = new Physijs.ConeMesh(
                spikeGeometry,
                Physijs.createMaterial(
                    spikeMaterial,
                    .4,
                    .99
                ),
                0
            );
            spike.position.x = i * 10 - 45;
            spike.position.y = 5;
            spike.position.z = j * 10 - 45;
            scene.add(spike);
            spikes.push(spike);
        }
    }
}());

render();
scene.simulate()


function render() {
    for (var i = 0; i < scene.children.length; i++) {
        var obj = scene.children[i];

        if (obj.position.y <= -50) {
            scene.remove(obj);
        }
    }

    // PENDULUM MOTION OF PLANE
    zValue = Math.PI / 24 * Math.sin(clock.getElapsedTime());

    plane.rotation.z = zValue;
    plane.__dirtyRotation = true;

    spikes.forEach(spike => { spike.rotation.z = zValue });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

// BUTTONS

(function initEvents() {
    document.getElementById('btn-spawn-ball').addEventListener('click', spawnBall);
    var autoSpawnBtn = document.getElementById('btn-auto-spawn');
    autoSpawnBtn.addEventListener('click', (e) => {
        var intervalTime = document.getElementById('auto-spawn-interval').value;
        if (!autoSpawnIntevalEnabled) {
            autoSpawnBtn.innerHTML = "Disable auto"
            autoSpawnInteval = setInterval(function () {
                spawnBall();
            }, intervalTime);
            autoSpawnIntevalEnabled = true;
        } else {
            autoSpawnBtn.innerHTML = "Enable auto"
            clearInterval(autoSpawnInteval);
            autoSpawnIntevalEnabled = false;
        }
    });


    document.getElementById('btn-clear').addEventListener('click', () => {
        for (var i = 0; i < scene.children.length; i++) {
            var obj = scene.children[i];
            if (obj.name === "ball") {
                scene.remove(obj);
            }
        }


    });

    function spawnBall() {
        ball = new Physijs.SphereMesh(
            new THREE.SphereGeometry(
                Math.random() * 1 + 4,
                8,
                8
            ),
            Physijs.createMaterial(
                new THREE.MeshLambertMaterial({
                    color: 0xff0000,
                    reflectivity: .8
                }),
                .4,
                .6
            ),
            1
        );
        var r = {
            x: Math.random() * (Math.PI - Math.PI / 12) + Math.PI / 12,
            y: Math.random() * (Math.PI - Math.PI / 12) + Math.PI / 12,
            z: Math.random() * (Math.PI - Math.PI / 12) + Math.PI / 12
        };
        ball.rotation.set(r.x, r.y, r.z);
        ball.position.x = 10 * Math.random() - 5;
        ball.position.y = 40;
        ball.position.z = 10 * Math.random() - 5;
        ball.castShadow = true;
        ball.receiveShadow = true;
        ball.name = 'ball'
        scene.add(ball);
    }
}())

