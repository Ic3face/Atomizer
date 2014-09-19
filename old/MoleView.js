/**
 * 
 * @name MoleView.js 
 */


/**
 * Deklarieren von Globalenvariablen
 */
var scene, camera, renderer, uhr, stats;

var objects = [];

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, 800/600, 0.1, 1000); 
renderer = new THREE.WebGLRenderer();
uhr = new THREE.Clock();
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '10px';

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
var geometry = new THREE.SphereGeometry(1, 20, 20); 
var geokugel = new THREE.SphereGeometry(0.5, 20, 20);
var geokugel2 = new THREE.SphereGeometry(0.5, 20, 20);
var skyBoxMesh = skyboxladen();
 
/**
 * Erstellen der Oberflächenbeschaffenheit und -verhalten auf Licht
 */
var material = new THREE.MeshLambertMaterial({color: 0x00aa00, wireframe: false});
var mat2 = new THREE.MeshLambertMaterial({color: 0xaa0000, wireframe: true});
var mat3 = new THREE.MeshLambertMaterial({color: 0xaa0000, wireframe: true});

/**
 * Erstellen der Objekte mit einer Geometrie und OFB
 */
var cube = new THREE.Mesh(geometry, material);
var kugel = new THREE.Mesh(geokugel, mat2);
var kugel2 = new THREE.Mesh(geokugel2, mat3);
var ambientlight = new THREE.AmbientLight(0x888888);
var directionalLight = new THREE.DirectionalLight(0xffffff);
objects.push(cube);
objects.push(kugel);
objects.push(kugel2);

/**
 * Positionieren von Objekten
 */
directionalLight.position.set(1, 1, 1).normalize();
camera.position.z = 5;
kugel.position.x = 2;
kugel2.position.x = -2;


/**
 * Hinzufügen von Objekten zu der Szene
 */
cube.add(kugel);
cube.add(kugel2);
scene.add(ambientlight);
scene.add(cube);
scene.add(skyBoxMesh);
scene.add(directionalLight); 


document.addEventListener("keypress", function(e){
	if(e.key == "w"){
		camera.rotation.x += (delta * 50 * Math.PI / 180);
	}
	if(e.key == "s"){
		camera.rotation.x -= (delta * 50 * Math.PI / 180);
	}
	if(e.key == "a"){
		camera.rotation.y += (delta * 50 * Math.PI / 180);
	}
	if(e.key == "d"){
		camera.rotation.y -= (delta * 50 * Math.PI / 180);
	}
 });


/**
 * Rendergröße festlegen und einfügen des Renderers in die DOM
 */
renderer.setSize(800, 600);
document.body.appendChild(renderer.domElement);
document.body.appendChild( stats.domElement );

/**
 * Probe
 */
document.addEventListener( 'mousedown', onDocumentMouseDown, false );

var projector = new THREE.Projector();

function onDocumentMouseDown( event ) {

	event.preventDefault();

	var vector = new THREE.Vector3( ( event.clientX / 800 ) * 2 - 1, - ( event.clientY / 600 ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

	}

	/*
	// Parse all the faces
	for ( var i in intersects ) {

		intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

	}
	*/
}
/**
 * Probe ENDE
 */

/**
 * Erstellen der Renderfunktion die immer wieder durchlaufen wird?
 */
var render = function(){
	
	requestAnimationFrame(render);
	delta = uhr.getDelta();
	
	cube.rotation.y += (delta * 5 * Math.PI / 180 );

	
	
	 renderer.render(scene, camera);
	 stats.update();
};


/**
 * Funktion
 * Laden und erstellen der Skybox
 */
function skyboxladen() {
	
	var directions  = ["SBF", "SBB", "SBT", "SBBo", "SBL", "SBR"];
	var materialArray = [];
	THREE.ImageUtils.crossOrigin = '';
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
	}));
	 
	var skyGeometry = new THREE.BoxGeometry( 500, 500, 500 );
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	
	return skyBox;
}



render();