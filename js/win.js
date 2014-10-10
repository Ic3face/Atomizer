/**
 * 
 * MoleView.js 
 */


var scene, camera, renderer, uhr, delta, stats, projector;

var container, controls;

var molekuel, namebox, descbox;

var objects = [];

function initThreeJs(task, atoms) {
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, 826/700, 0.1, 1000); 
	renderer = new THREE.WebGLRenderer({antialias: true});
	uhr = new THREE.Clock();
	stats = new Stats();
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.noKeys = true;
	projector = new THREE.Projector();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '10px';
	container = document.getElementById('playground');
	delta = uhr.getDelta();
	
	molekuel = buildmole(task, atoms);
	molekuel.name = "Molekül";
	
	/**
	 * Zusammensuchen der HTML-Elemente
	 */
	namebox = jQuery("#atomname");
	descbox = jQuery("#atomdesc");
	
	var lichtspiel = new THREE.Object3D();
	var ambientlight = new THREE.AmbientLight(0x555555);
	var globalLight = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
	var directionalLight = new THREE.DirectionalLight(0x555555);
	
	directionalLight.position.set(0, -10, 0);
	directionalLight.target.add(molekuel);
	
	/**
	 * Hinzufügen von Objekten zu der Szene
	 */
	scene.add(ambientlight);
	lichtspiel.add(directionalLight);
	lichtspiel.add(globalLight);
	scene.add(lichtspiel);
	scene.add(molekuel);


	/**
	 * Rendergröße festlegen und einfügen des Renderers in die DOM
	 */
	renderer.setSize(826, 700);
	renderer.setClearColor(0x3e3e3e);
	renderer.domElement.id = "cview";
	container.appendChild(renderer.domElement);
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousedown', klicksteuerung, false );
	document.addEventListener( 'mousemove', hoversteuerung, false );

	render();
	
}


var atomarray;


function buildmole (task, atoms) {
	
	var obj3d = new THREE.Object3D();
	atomarray = [];
	for (i = 0; i < task.winstate.atoms.length; i++){
		for(j = 0; j < atoms.length; j++){
			if(task.winstate.atoms[i] == atoms[j].sign){
				
				var geokugel = new THREE.SphereGeometry(atoms[j].radius, 20, 20);
				var matkugel = new THREE.MeshPhongMaterial({color: (parseInt(atoms[j].color, 16)), emissive: 0x101010, shininess: 30, specular: 0x242424, wireframe: false});
				
				var atom = new THREE.Mesh(geokugel, matkugel);
				
				atom.name = atoms[j].name;
				atom.desc = atoms[j].desc;
				atom.sign = atoms[j].sign;
				
				objects.push(atom);
				atomarray.push(atom);
				obj3d.add(atom);
			}
		}
	}
	
	var verbindmat = new THREE.MeshPhongMaterial({color: 0xcccccc, emissive: 0x101010, shininess: 40, specular: 0xaaaaaa, wireframe: false});
	
	switch(task.hint){
	
	case "H2O":
		
		atomarray[0].position.set(-120,-60,0);
		atomarray[1].position.set(120,-60,0);
		atomarray[2].position.set(0,0,0);
			
		var vec1 = new THREE.Vector3((atomarray[0].position.x-atomarray[2].position.x),(atomarray[0].position.y-atomarray[2].position.y),(atomarray[0].position.z-atomarray[2].position.z));
		var vec2 = new THREE.Vector3((atomarray[1].position.x-atomarray[2].position.x),(atomarray[1].position.y-atomarray[2].position.y),(atomarray[1].position.z-atomarray[2].position.z));
		
		var geoverbindung = new THREE.CylinderGeometry(8, 8, vec1.length(), 16);
		
		var verbind = new THREE.Mesh(geoverbindung, verbindmat);
		var verbind2 = new THREE.Mesh(geoverbindung, verbindmat);
		
		verbind.position.set((vec1.x/2), (vec1.y/2), (vec1.z/2));
		verbind2.position.set((vec2.x/2), (vec2.y/2), (vec1.z/2));
		
		rotbindung (atomarray[2], atomarray[0],verbind);
		rotbindung (atomarray[2], atomarray[1],verbind2);
		
		obj3d.add(verbind);
		obj3d.add(verbind2);
		
		camera.position.z = 280;
		controls.maxDistance = 500;
		controls.minDistance = 220;
		
		break;
		
	case "CO2":
		
	}
	
	
	return obj3d;
	
}

/**
 * Erstellen der Renderfunktion die immer wieder durchlaufen wird?
 */
function render (){
	
	requestAnimationFrame(render);
	delta = uhr.getDelta();
	
	molekuel.rotation.y += (delta * 5 * Math.PI / 180 );
	
	 renderer.render(scene, camera);
	 stats.update();
};

/**
 * Funktion für die Ausrichtung einer Verbindung zwischen 2 Atomen
 * @param origin 
 * @param target
 */
function rotbindung ( origin , target, rotobj) {
	
	var quat = new THREE.Quaternion();
	var vec1 = new THREE.Vector3((target.position.x - origin.position.x), (target.position.y - origin.position.y), (target.position.z - origin.position.z) );
	var vec2 = new THREE.Vector3(0,1,0);
	var vec3 = new THREE.Vector3(vec1.x, vec1.y, vec1.z);
	
	var angle = -(vec1.angleTo(vec2));
	
	vec3.cross(vec2);
	vec3.normalize();
	
	quat.setFromAxisAngle(vec3, angle);
	rotobj.quaternion.multiplyQuaternions(quat, target.quaternion);
}

/**
 * Klickfunktion die vom EventListener aufgerufen wird
 */
function klicksteuerung( event ) {

	event.preventDefault();
	
	var poscanvasY = document.getElementById("playground").offsetTop;
	var poscanvasX = document.getElementById("playground").offsetLeft;


	var vector = new THREE.Vector3( ( (event.clientX - poscanvasX) / 826 ) * 2 - 1, - ( (event.clientY - poscanvasY) / 700 ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		//do anything

	}

}

/**
 * Hoverfunktion die vom EventListener aufgerufen wird
 */
function hoversteuerung(event) {
	
	event.preventDefault();
	var poscanvasY = document.getElementById("playground").offsetTop;
	var poscanvasX = document.getElementById("playground").offsetLeft;

	var vector = new THREE.Vector3( ( (event.clientX - poscanvasX) / 826) * 2 - 1, - ( (event.clientY - poscanvasY) / 700 ) * 2 + 1, 0.5 );
	projector.unprojectVector(vector, camera);
	
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	
	var intersects = raycaster.intersectObjects( objects );
	
	if ( intersects.length > 0 ) {

		if ( intersects[ 0 ].object.name )
		{
			namebox.text("" + intersects[ 0 ].object.name);
			descbox.text("" + intersects[ 0 ].object.desc);
		}

	}
	else
	{
		namebox.text("");
		descbox.text("");
	}
	
}
