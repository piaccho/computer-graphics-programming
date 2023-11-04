/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables
var mirrorCube, mirrorCubeCamera; // for mirror material
var mirrorSphere, mirrorSphereCamera; // for mirror material

init();
animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// orbital controls
	ctr = new THREE.OrbitControls( camera, renderer.domElement);
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// FLOOR
	var floorTexture = new THREE.TextureLoader().load( 'textures/stone.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 5, 5 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side:THREE.BackSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	
	// SKYBOX/FOG
	var materialArray1 = [];
	materialArray1.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/dawnmountain-xpos.png' ) }));
	materialArray1.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/dawnmountain-xneg.png' ) }));
	materialArray1.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/dawnmountain-ypos.png' ) }));
	materialArray1.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/dawnmountain-yneg.png' ) }));
	materialArray1.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/dawnmountain-zpos.png' ) }));
	materialArray1.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/dawnmountain-zneg.png' ) }));
	for (var i = 0; i < 6; i++)
	   materialArray1[i].side = THREE.BackSide;
	var skyboxMaterial1 = new THREE.MeshFaceMaterial( materialArray1 );
	
	var materialArray2 = [];
	materialArray2.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/DarkSea-xpos.jpg' ) }));
	materialArray2.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/DarkSea-xneg.jpg' ) }));
	materialArray2.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/DarkSea-ypos.jpg' ) }));
	materialArray2.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/DarkSea-yneg.jpg' ) }));
	materialArray2.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/DarkSea-zpos.jpg' ) }));
	materialArray2.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/DarkSea-zneg.jpg' ) }));
	for (var i = 0; i < 6; i++)
	   materialArray2[i].side = THREE.BackSide;
	var skyboxMaterial2 = new THREE.MeshFaceMaterial( materialArray2 );

	var skyboxGeom = new THREE.BoxGeometry( 5000, 5000, 5000, 64, 64, 64 );
	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial2 );
	scene.add( skybox );	
	
	////////////
	// CUSTOM //
	////////////
	
		
	var cubeGeom = new THREE.CubeGeometry(200, 200, 30,1,1,1);
	mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
	// mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
	scene.add( mirrorCubeCamera );
	var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );
	mirrorCube = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
	mirrorCube.position.set(-75,50,0);
	//mirrorCubeCamera.position = mirrorCube.position;    not working with new three.js
	mirrorCubeCamera.position.set(-75,50,0);
	scene.add(mirrorCube);	
	
	var sphereGeom =  new THREE.SphereGeometry( 50, 32, 16 ); // radius, segmentsWidth, segmentsHeight
	mirrorSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
	// mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
	scene.add( mirrorSphereCamera );
	var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
	mirrorSphere = new THREE.Mesh( sphereGeom, mirrorSphereMaterial );
	mirrorSphere.position.set(75,50,0);
	//mirrorSphereCamera.position = mirrorSphere.position;
	mirrorSphereCamera.position.set(75,50,0);
	scene.add(mirrorSphere);


	// setup the control gui
	var controls = new function () {
		this.changeSkybox = "DawnMountain";
		this.changeSkybox = function (e) {
			switch(e) {
				case "DawnMountain":
					skybox.material = skyboxMaterial1;
					break;
				case "DarkSea":
					skybox.material = skyboxMaterial2;
					break;
			}
		}
	};


	var gui = new dat.GUI();
	gui.add(controls, "changeSkybox", ['DawnMountain', 'DarkSea']).onChange(controls.changeSkybox);

}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	if ( keyboard.pressed("z") ) 
	{ 
		// do something
	}
	
	controls.update();
	stats.update();
}

function render() 
{
	// move the CubeCamera to the position of the object
	//    that has a reflective surface, "take a picture" in each direction
	//    and apply it to the surface.
	// need to hide surface before and after so that it does not
	//    "get in the way" of the camera
	mirrorCube.visible = false;
	mirrorCubeCamera.updateCubeMap( renderer, scene );
	mirrorCube.visible = true;

	mirrorSphere.visible = false;
	mirrorSphereCamera.updateCubeMap( renderer, scene );
	mirrorSphere.visible = true;

    //torus.visible = false;
	//mirrorTorusCamera.updateCubeMap( renderer, scene );
	//torus.visible = true;
	
	renderer.render( scene, camera );
}
