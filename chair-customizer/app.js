let container, camera, renderer, scene, model, controls;

const BACKGROUND_COLOR = 0xf1f1f1;
const MODEL_POSITION_Y = -3;
const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, shininess: 10 });
const INITIAL_MAP = [
	{ childId: 'Cube001_Cube003', mtl: INITIAL_MTL }, // base
	{ childId: 'Cube002_Cube004', mtl: INITIAL_MTL }, // left
	{ childId: 'Cube003_Cube006', mtl: INITIAL_MTL }, // right
	{ childId: 'Cube004_Cube007', mtl: INITIAL_MTL }, // horizontal cusion
	{ childId: 'Cube005_Cube008', mtl: INITIAL_MTL }, // ebow left
	{ childId: 'Cube006_Cube009', mtl: INITIAL_MTL }, // vertical cusion
	{ childId: 'Cube007_Cube010', mtl: INITIAL_MTL }, // ebow right
	{ childId: 'Cube_Cube001', mtl: INITIAL_MTL }, // back
];
const colors = [
	{ color: '66533C' },
	{ color: '173A2F' },
	{ color: '153944' },
	{ color: '27548D' },
	{ color: '438AAC' },  
];

function init() {
	container = document.querySelector('.scene');

	scene = new THREE.Scene();
	
	const fov = 50;
	const aspect = container.clientWidth / container.clientHeight;
	const near = 0.1;
	const far = 1000;

	// create camera
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 2, 15);

	// create color for canvas
	scene.background = new THREE.Color(BACKGROUND_COLOR);
	scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

	// create renderer
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;

	container.appendChild(renderer.domElement);

	// load model
	let loader = new THREE.GLTFLoader();

	loader.load('./chair.glb', function(gltf) {
		model = gltf.scene;
		model.scale.set(2, 2, 2);
		model.position.y = MODEL_POSITION_Y;
		model.rotation.z += 0.005;
		// model.rotation.y = Math.PI / 4; // rotate model : 180 degress = Math.PI
		model.traverse(function(o) {
			if (o.isMesh) {
				o.castShadow = true;
       			o.receiveShadow = true;
			}
		});

		// set initial texture
		for (let object of INITIAL_MAP) {
			initColor(model, object.childId, object.mtl);
		}
		
		scene.add(model);
		renderer.render(scene, camera);
	}, undefined, function(error) {
		console.log(error);
	});

	// create ambient light
	// const ambient = new THREE.AmbientLight(0x404040, 2);
	// scene.add(ambient);
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
    hemiLight.position.set( 0, 50, 0 );
	// add hemisphere light to scene   
	scene.add( hemiLight );

	// create derection light
	const dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );
    dirLight.position.set( -8, 12, 8 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    scene.add(dirLight);

    // create floor for shadow
    const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    const floorMaterial = new THREE.MeshPhongMaterial({
    	color: 0xeeeeee,
    	shininess: 0
	}); // a material for shiny surface
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.receiveShadow = true;
	floor.rotation.x = -0.5 * Math.PI;
	floor.position.y = MODEL_POSITION_Y;
	scene.add(floor);

	// create control
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI / 2;
	controls.minPolarAngle = Math.PI / 3;
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.dampingFactor = 0.1;
	controls.autoRotate = false;
	controls.autoRotateSpeed = 0.2; // 30
}

function animate() {
	controls.update()
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

// add the texture to the model
function initColor(parent, type, mtl) {
	parent.traverse((o) => {
	if (o.isMesh) {
		if (o.name.includes(type)) {
			o.material = mtl;
			o.nameID = type; // Set a new property to identify this object
		}
	}
 });
}

function initSwatch() {
	buildColors();
}

function setMaterial(parent, type, mtl) {
	parent.traverse(function(o) {
		if (o.isMesh && o.nameID !== null) {
			if (o.nameID === type) {
				o.material = mtl;
			}
		}
	})
}

function selectSwatch(event) {
	const key = event.target.dataset.key;
	let color = colors[parseInt(key, 10)].color;

	const mtl = new THREE.MeshPhongMaterial({
		color: parseInt('0x' + color),
		shininess: 10,
	});

	setMaterial(model, 'Cube004_Cube007', mtl);
}

function buildColors() {
	const TRAY = document.getElementById('js-tray-slide');
	
	for(let [i, color] of colors.entries()) {
		let swatch = document.createElement('div');
		swatch.classList.add('tray-swatch');
		swatch.style.backgroundColor = '#' + color.color;
		swatch.setAttribute('data-key', i);

		TRAY.append(swatch);
	}

	const swatches = document.querySelectorAll('.tray-swatch');

	for(const swatch of swatches) {
		swatch.addEventListener('click', selectSwatch);
	}
}

init();

animate();

initSwatch();