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
 * Hilfsvariablen für die Bilderpfade
 */
var imagePrefix = "bilder/";
var imageSuffix = ".jpg";

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
var mat2 = new THREE.MeshPhongMaterial({color: 0xaa0000, wireframe: false});
var mat3 = new THREE.MeshPhongMaterial({color: 0xcccccc, wireframe: false});

/**
 * Erstellen der Objekte mit einer Geometrie und OFB
 */
var cube = new THREE.Mesh(geometry, material);
var kugel2 = new THREE.Mesh(geokugel2, mat2);
var lichtspiel = new THREE.Object3D();
var verbindung1 = new THREE.Mesh(geoverbindung, mat3);
var ambientlight = new THREE.AmbientLight(0x888888);
var directionalLight = new THREE.DirectionalLight(0xffffff);
cube.name = "Sauerstoff";
kugel2.name = "Wasserstoff";
objects.push(cube);
objects.push(kugel2);
objects.push(verbindung1);

/**
 * Positionieren von Objekten
 */
directionalLight.position.set(5, 5, 5);
directionalLight.target.add(cube);
camera.position.z = 25;
kugel2.position.set( 20, -4, 0);
/**
 * TEST
 * START
 */
var axis1 = new THREE.AxisHelper(5);


var vec1 = new THREE.Vector3((kugel2.position.x - cube.position.x) , (kugel2.position.y - cube.position.y) , (kugel2.position.z - cube.position.z) );
var rotquat = new THREE.Quaternion((kugel2.position.x - cube.position.x), (kugel2.position.y - cube.position.y), (kugel2.position.z - cube.position.z));
/*var angle = vec1.angleTo(vec2);
rotquat.setFromAxisAngle(vec2, angle );

vec2.set( 0, 1, 0).normalize();
var angle2  = vec1.angleTo(vec2);
rotquat.setFromAxisAngle(vec2, angle2 );


vec2.set(0, 0, 1).normalize();
var angle3 = vec1.angleTo(vec2);
rotquat.setFromAxisAngle(vec2, angle3 );*/


//verbindung1.quaternion.multiplyQuaternions( rotquat, verbindung1.quaternion );


/**
 * Test
 * ENDE
 */
	

verbindung1.position.set((kugel2.position.x - cube.position.x)/2, (kugel2.position.y - cube.position.y)/2, (kugel2.position.z - cube.position.z )/2);

/**
 * Hinzufügen von Objekten zu der Szene
 */
cube.add(kugel2);
cube.add(verbindung1);
scene.add(ambientlight);
scene.add(cube);
verbindung1.add(axis1);
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
	
	//cube.rotation.y += (delta * 5 * Math.PI / 180 );
	//lichtspiel.rotation.y -= (delta * 20  * Math.PI / 180 );
	
	
	 renderer.render(scene, camera);
	 stats.update();/*0x3e3e3e*/
};


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
