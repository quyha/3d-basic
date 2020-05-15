let container;
let camera;
let renderer;
let scene;
let car;

function init() {
	container = document.querySelector('.scene');

	// create scene
	scene = new THREE.Scene()

	const fov = 55;
	const aspect = container.clientWidth / container.clientHeight;
	const near = 0.1;
	const far = 1000;
	
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 50, 550);

	const ambient = new THREE.AmbientLight(0x404040, 2);

	scene.add(ambient);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
	directionalLight.position.set(10, 200, 200);

	scene.add(directionalLight);

	// renderer
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	container.appendChild(renderer.domElement);

	// load model

	let loader = new THREE.GLTFLoader();
	
	loader.load('./lamborghini.glb', function(gltf) {
		scene.add(gltf.scene);
		car = gltf.scene.children[0];
		renderer.render(scene, camera);
		animate();
	}, function() {}, function(error) {
		console.log(error);
	});
}

function animate() {
	requestAnimationFrame(animate);
	car.rotation.z += 0.005;
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

init();