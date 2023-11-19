var camera, scene, renderer;
var geometry, material, mesh;
var controls, time = Date.now();

var objects = [];

var ray;


var instructions = document.getElementById('instructions');

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function (event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

            controls.enabled = true;


        } else {

            controls.enabled = false;

            instructions.style.display = '';

        }

    }

    var pointerlockerror = function (event) {

        instructions.style.display = '';

    }

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    instructions.addEventListener('click', function (event) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if (/Firefox/i.test(navigator.userAgent)) {

            var fullscreenchange = function (event) {

                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                    document.removeEventListener('fullscreenchange', fullscreenchange);
                    document.removeEventListener('mozfullscreenchange', fullscreenchange);

                    element.requestPointerLock();
                }

            }

            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        } else {

            element.requestPointerLock();

        }

    }, false);

} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xa516b8, 0, 750);

    var light = new THREE.DirectionalLight(0xa516b82, 1.5);
    light.position.set(1, 1, 1);
    scene.add(light);

    var light = new THREE.DirectionalLight(0xa516b8, 0.75);
    light.position.set(-1, - 0.5, -1);
    scene.add(light);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    ray = new THREE.Raycaster();
    ray.ray.direction.set(0, -1, 0);

    // floor

    geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {

        var vertex = geometry.vertices[i];
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;

    }

    for (var i = 0, l = geometry.faces.length; i < l; i++) {

        var face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.1, 0.75, Math.random() * 0.25 + 0.25);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.1, 0.75, Math.random() * 0.25 + 0.25);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.1, 0.75, Math.random() * 0.25 + 0.25);

    }

    material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // objects

    geometry = new THREE.BoxGeometry(20, 20, 20);

    for (var i = 0, l = geometry.faces.length; i < l; i++) {

        var face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.1, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.1, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.1, 0.75, Math.random() * 0.25 + 0.75);
    }

    for (var i = 0; i < 500; i++) {

        material = new THREE.MeshPhongMaterial({ specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        mesh.position.y = Math.floor(Math.random() * 20) * 20 + 10;
        mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        scene.add(mesh);

        material.color.setHSL(Math.random() * 0.2 + 0.1, 0.75, Math.random() * 0.25 + 0.75);

        objects.push(mesh);``
    }

    // CROSSHAIR
    var maskTexture = new THREE.TextureLoader().load("textures/crosshair.png");
    var maskGeometry = new THREE.PlaneGeometry(1, 1);
    var maskMaterial = new THREE.MeshBasicMaterial({ map: maskTexture, transparent: true });
    var mask = new THREE.Mesh(maskGeometry, maskMaterial);
    mask.position.set(0, 0, -10);
    camera.add(mask);

    // HAND WITH GUN
    var gunBodyMaterial = new THREE.MeshBasicMaterial({ color: 0x615e5a, transparent: true,  });
    var gunDetailMaterial = new THREE.MeshBasicMaterial({ color: 0x2b2b2a, transparent: true });
    var handMaterial = new THREE.MeshBasicMaterial({ color: 0xbf9469, transparent: true });

    var gunBody1Geometry = new THREE.BoxGeometry(0.5, 0.5, 3);
    var gunBody1 = new THREE.Mesh(gunBody1Geometry, gunBodyMaterial);
    gunBody1.position.set(3, -2, -6);
    const line1 = new THREE.LineSegments(new THREE.EdgesGeometry(gunBody1Geometry), new THREE.LineBasicMaterial({ color: 0x000000}));
    line1.position.copy(gunBody1.position);
    line1.scale.set(1.001, 1.001, 1.001);
    
    var gunBody2Geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    var gunBody2 = new THREE.Mesh(gunBody2Geometry, gunBodyMaterial); 
    gunBody2.position.set(3, -3.3, -5);
    const line2 = new THREE.LineSegments(new THREE.EdgesGeometry(gunBody2Geometry), new THREE.LineBasicMaterial({ color: 0x000000 }));
    line2.position.copy(gunBody2.position);
    line2.scale.set(1.001, 1.001, 1.001);

    var gunDetail1Geometry = new THREE.BoxGeometry(0.05, 0.1, 0.2);
    var gunDetail1 = new THREE.Mesh(gunDetail1Geometry, gunDetailMaterial);
    gunDetail1.position.set(3, -1.7, -7.2);
    var gunDetail2Geometry = new THREE.BoxGeometry(0.05, 0.1, 0.1);
    var gunDetail2 = new THREE.Mesh(gunDetail2Geometry, gunDetailMaterial);
    gunDetail2.position.set(2.9, -1.75, -4.7);
    var gunDetail3Geometry = new THREE.BoxGeometry(0.05, 0.1, 0.1);
    var gunDetail3 = new THREE.Mesh(gunDetail3Geometry, gunDetailMaterial);
    gunDetail3.position.set(3.1, -1.75, -4.7);

    var handGeometry = new THREE.BoxGeometry(1, 1, 3);
    var hand = new THREE.Mesh(handGeometry, handMaterial);
    hand.position.set(3, -2.75, -4);
    const line3 = new THREE.LineSegments(new THREE.EdgesGeometry(handGeometry), new THREE.LineBasicMaterial({ color: 0x99744e }));
    line3.position.copy(hand.position);
    line3.scale.set(1.001, 1.001, 1.001);

    camera.add(gunBody1);
    camera.add(line1);
    camera.add(gunBody2);
    camera.add(line2);
    camera.add(gunDetail1);
    camera.add(gunDetail2);
    camera.add(gunDetail3);
    camera.add(hand);
    camera.add(line3);

    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    //

    controls.isOnObject(false);

    ray.ray.origin.copy(controls.getObject().position);
    ray.ray.origin.y -= 10;

    var intersections = ray.intersectObjects(objects);

    if (intersections.length > 0) {

        var distance = intersections[0].distance;

        if (distance > 0 && distance < 10) {

            controls.isOnObject(true);

        }

    }

    controls.update(Date.now() - time);

    renderer.render(scene, camera);

    time = Date.now();

}