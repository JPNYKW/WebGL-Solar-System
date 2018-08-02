(function () {
	function init() {
		// Create global variables.
		window.zoom_speed = 320;
		window.frame_speed = 1;
		window.frame = 0;

		// Create scope variable.
		let mouse = {
				down: false,
				drag: {
					start_x: null,
					start_y: null
				}
			},
			speed = document.getElementById('speed'),
			camera_x = document.getElementById('camera-x'),
			camera_y = document.getElementById('camera-y'),
			camera_z = document.getElementById('camera-z'),
			camera_view = document.getElementById('is-look-at-sun'),
			log_output = document.getElementById('log-output'),
			view_log = document.getElementById('view-log');

		// Create important variables to WebGL 3D.
		const width = window.innerWidth,
			height = window.innerHeight,
			scene = new THREE.Scene(),
			light = new THREE.DirectionalLight(0xFFFFFF, 2),
			camera = new THREE.PerspectiveCamera(45, width / height, 1, 800000),
			renderer = new THREE.WebGLRenderer({
				canvas: document.getElementById('webgl-canvas')
			}),
			start_camera_y = 27000,
			start_camera_z = 21000;

		// Setting of renderer, camera and light data.
		renderer.setSize(width, height);
		camera.position.set(0, start_camera_y, start_camera_z);
		light.position.set(0, 2, 1);
		scene.add(light);

		// Dataset of solar system.
		let planet_stack = [],
			planet_distance_ratio = 30,
			planet_distance = [0, 43, 75, 107, 160, 560, 1030, 2040, 3200],
			planet_size_ratio = 4,
			planet_size = [1392, 4.879395, 12.1036, 12.7563, 6.794396, 142.984, 120.536, 51.118, 49.572],
			planet_name = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'],
			planet_revolution_cycle = [1, 2.554279868136865, 4.152097305899739, 7.809253154484484, 49.208821189041714, 122.23371603955894, 347.57303626236217, 683.778560873025];

		// Create planets of solar system.
		console.log('CREATE.SolarSystem');
		log_output.value += '\nCREATE.SolarSystem\n';
		for (let i = 0; i < 9; i++) {
			let x = planet_distance[i] * planet_distance_ratio,
				size = planet_size[i] * (i ? planet_size_ratio : 1.1),
				texture = `Texture/${planet_name[i]}.jpg`;

			// Planet main
			console.log(x, 0, 0, size, texture);
			log_output.value += `Finish : ${[x, 0, 0, size, texture].join(' ')}\n`;
			let planet_geometry = new THREE.SphereGeometry(size, 120, 120),
				planet_loader = new THREE.TextureLoader(),
				planet_texture = planet_loader.load(texture),
				planet_material = new THREE.MeshStandardMaterial({
					map: planet_texture
				}),
				planet_sphere = new THREE.Mesh(planet_geometry, planet_material);

			planet_sphere.position.set(x, 0, 0);
			scene.add(planet_sphere);

			let name = texture.match(/\/.*\./)[0].split(/\//)[1].split(/\./)[0];
			planet_stack.push({
				object: planet_sphere,
				x,
				y: 0,
				z: 0,
				size,
				name,
				texture
			});

			// Saturn ring
			if (i == 6) {
				window.ring_geometry = new THREE.TorusGeometry(size * 2, 20, 32, 32);
				window.ring_loader = new THREE.TextureLoader();
				window.ring_texture = planet_loader.load('Texture/saturn_ring.jpg');
				window.ring_material = new THREE.MeshStandardMaterial({
					map: ring_texture
				});
				window.ring_sphere = new THREE.Mesh(ring_geometry, ring_material);

				ring_sphere.position.set(x, 0, 0);
				ring_sphere.rotation.y = 90;
				scene.add(ring_sphere);
			}
		}

		// Start main loop.
		log_output.value += 'DONE';
		console.log('DONE');
		tick();

		// The function will be rendering in enterframe by FPS of user's PC.
		function tick() {
			// Planet events.
			planet_stack.map((planet, index) => {
				let r = planet.x;
				if (planet.name !== 'sun') {
					// The revolution
					let _frame = frame / planet_revolution_cycle[index - 1];
					planet.object.position.set(Math.cos(_frame * Math.PI / 180) * r, 0, Math.sin(_frame * Math.PI / 180) * r);
				}
				// The rotation
				planet.object.rotation.y += .01;
				if (planet.name === 'saturn') ring_sphere.position.set(planet.object.x, planet.object.y, planet.object.z);
			});

			if (camera_view.checked) camera.lookAt(new THREE.Vector3(0, 0, 0));
			renderer.render(scene, camera);
			requestAnimationFrame(tick);
			frame += frame_speed;

			frame_speed = speed.value >> 0;
			log_output.style.opacity = view_log.checked >> 0;
			camera.position.set(camera_x.value >> 0, camera_y.value >> 0, camera_z.value >> 0);
		}
	}

	// When reading is completed, call the init().
	window.onload = init;
})();
