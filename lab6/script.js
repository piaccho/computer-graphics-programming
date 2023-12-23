var container, stats, controls;
var camera, scene, renderer, light;

var clock = new THREE.Clock();

var mixer1, mixer2, mixer3, mixer4;

await init();
animate();

async function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(400, 200, 100);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add(light);

    // ground
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    let action1, action2;
    
    // model 1 - 91 frames / 66 frame gave hit
    var loader1 = new THREE.FBXLoader();
    await loader1.load('models/fbx/Chapa-Giratoria.fbx', function (object) {
        var clip = object.animations[0];
        var newClip = THREE.AnimationUtils.subclip(clip, 'Chapa-Giratoria-trimmed', 46, 90);
        mixer1 = new THREE.AnimationMixer(object);
        action1 = mixer1.clipAction(newClip);

        object.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        object.position.set(130, 0, 200);
        object.rotation.set(0, 10, 0);

        scene.add(object);

    });

    

    // model 2 - 125 frames / 20 frame got hit
    var loader2 = new THREE.FBXLoader();
    await loader2.load('models/fbx/Dying Backwards.fbx', function (object) {
        
        var clip = object.animations[0];
        var newClip = THREE.AnimationUtils.subclip(clip, 'dying_backwards_trimmed', 0, 44);
        mixer2 = new THREE.AnimationMixer(object);
        action2 = mixer2.clipAction(newClip);
        
        object.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        scene.add(object);

    });

    setTimeout(function () {
        action1.play();
        action2.play();
      }, 3000);



    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    if (mixer1) mixer1.update(delta);
    if (mixer2) mixer2.update(delta);

    renderer.render(scene, camera);

    stats.update();

}