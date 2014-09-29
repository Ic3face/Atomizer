/**
 * 
 * MoleView.js 
 */
function initThreeJs(task, atoms) {
    console.log(task.name);
    for(var i = 0; i < atoms.length; i++) {
        console.log(atoms[i].name);
    }
}

/**
 * Deklarieren von Globalenvariablen
 */
var scene, camera, renderer, uhr, stats, projector;

var windiv, container, context1, texture1, sprite1;

var objects = [];

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, 826/700, 0.1, 1000); 
renderer = new THREE.WebGLRenderer({antialias: true});
uhr = new THREE.Clock();
stats = new Stats();
projector = new THREE.Projector();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '10px';
container = document.getElementById('playground');


/**
 * Zusammensuchen der HTML-Elemente
 */
var namebox = jQuery("#atomname");
var descbox = jQuery("#atomdesc");


/**
 * Hilfsvariable für die Zeit zwischen jedem Frame
 */
var delta = uhr.getDelta();

/**
 * Erstellen der Geometrie von Körpern
 */ 
var geometry = new THREE.SphereGeometry(5, 20, 20); 
var geokugel2 = new THREE.SphereGeometry(2, 20, 20);
var geoverbindung = new THREE.CylinderGeometry(0.5, 0.5, 8);

/**
 * Erstellen der Oberflächenbeschaffenheit und -verhalten auf Licht
 */
var material = new THREE.MeshPhongMaterial({color: 0x00aa00, wireframe: false});
var mat2 = new THREE.MeshPhongMaterial({color: 0xaa0000, emissive: 0x101010, shininess: 30, specular: 0x242424, wireframe: false});
var mat3 = new THREE.MeshPhongMaterial({color: 0xcccccc, emissive: 0x101010, shininess: 40, specular: 0xaaaaaa, wireframe: false});

/**
 * Erstellen der Objekte mit einer Geometrie und OFB
 */
var cube = new THREE.Mesh(geometry, material);
var kugel2 = new THREE.Mesh(geokugel2, mat2);
var kugel3 = new THREE.Mesh(geokugel2, mat2);
var lichtspiel = new THREE.Object3D();
var verbindung1 = new THREE.Mesh(geoverbindung, mat3);
var verbindung2 = new THREE.Mesh(geoverbindung, mat3);
var ambientlight = new THREE.AmbientLight(0x555555);
var directionalLight = new THREE.DirectionalLight(0xffffff);
cube.name = "Sauerstoff";
kugel2.name = "Wasserstoff";
objects.push(cube);
objects.push(kugel2);
objects.push(kugel3);
objects.push(verbindung1);
objects.push(verbindung2);

/**
 * Positionieren von Objekten
 */
directionalLight.position.set(5, 5, 5);
directionalLight.target.add(cube);
camera.position.z = 25;
kugel2.position.set( -10, -4, 0);
kugel3.position.set( 10, -4, 0);
verbindung1.position.set((kugel2.position.x - cube.position.x)/2, (kugel2.position.y - cube.position.y)/2, (kugel2.position.z - cube.position.z )/2);
verbindung2.position.set((kugel3.position.x - cube.position.x)/2, (kugel3.position.y - cube.position.y)/2, (kugel3.position.z - cube.position.z )/2);
cube.position.set(0, 0, 0);

rotbindung (cube, verbindung1);
rotbindung (cube, verbindung2);

/**
 * TEST
 * START
 */
geoverbindung.parameters.height = ( new THREE.Vector3((kugel2.position.x - cube.position.x), (kugel2.position.y - cube.position.y), (kugel2.position.z - cube.position.z)).length());
console.log(geoverbindung.parameters.height);




/**
 * Test
 * ENDE
 */


/**
 * Hinzufügen von Objekten zu der Szene
 */
cube.add(kugel2);
cube.add(kugel3);
cube.add(verbindung1);
cube.add(verbindung2);
scene.add(ambientlight);
scene.add(cube);
lichtspiel.add(directionalLight);
scene.add(lichtspiel); 


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


/**
 * Erstellen der Renderfunktion die immer wieder durchlaufen wird?
 */
function render (){
	
	requestAnimationFrame(render);
	delta = uhr.getDelta();
	
	cube.rotation.y += (delta * 5 * Math.PI / 180 );
	//lichtspiel.rotation.y -= (delta * 20  * Math.PI / 180 );
	
	
	 renderer.render(scene, camera);
	 stats.update();
};

/**
 * Funktion für die Ausrichtung einer Verbindung zwischen 2 Atomen
 * @param origin 
 * @param target
 */
function rotbindung ( origin , target) {
	
	var quat = new THREE.Quaternion();
	var vec1 = new THREE.Vector3((target.position.x - origin.position.x), (target.position.y - origin.position.y), (target.position.z - origin.position.z) );
	var vec2 = new THREE.Vector3(0,1,0);
	var vec3 = new THREE.Vector3(vec1.x, vec1.y, vec1.z);
	
	var angle = -(vec1.angleTo(vec2));
	
	vec3.cross(vec2);
	vec3.normalize();
	
	quat.setFromAxisAngle(vec3, angle);
	target.quaternion.multiplyQuaternions(quat, target.quaternion);
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

		intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

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
