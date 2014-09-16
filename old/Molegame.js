/**
 * Meine.js ist ein Test für WebGL mit three.js
 */


/**
 * Deklarieren der Szene, Kamera, Renderer und Uhr
 */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); 
var renderer = new THREE.WebGLRenderer();
var uhr = new THREE.Clock();
 
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
var geometry = new THREE.BoxGeometry(1,1,1); 

 
/**
 * Erstellen der Oberflächenbeschaffenheit und -verhalten auf Licht
 */
var material = new THREE.MeshPhongMaterial({color: 0x00aa00, envmap: materialArray});
var materialArray = [];


/**
 * Erstellen der Objekte mit einer Geometrie und OFB
 */
var cube = new THREE.Mesh(geometry, material);
var ambientlight = new THREE.AmbientLight(0x888888);
var directionalLight = new THREE.DirectionalLight(0xffffff);

/**
 * Positionieren von Objekten
 */
directionalLight.position.set(1, 1, 1).normalize();
camera.position.z = 5;


/**
 * Hinzufügen von Objekten zu der Szene
 */
scene.add(ambientlight);
scene.add(cube);
scene.add(skyboxladen());
scene.add(directionalLight); 


/**
 * Rendergröße festlegen und einfügen des Renderers in die DOM
 */
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * Erstellen der Renderfunktion die immer wieder durchlaufen wird?
 */
var render = function(){
	
	requestAnimationFrame(render);
	delta = uhr.getDelta();
	
	cube.rotation.x += (delta * 5 * Math.PI / 180 );
	cube.rotation.y += (delta * 5 * Math.PI / 180 );
	
	document.addEventListener("keypress", function(e){
		if(e.key == "w"){
			camera.rotation.x += (delta * Math.PI / 180);
		}
		if(e.key == "s"){
			camera.rotation.x -= (delta * Math.PI / 180);
		}
		if(e.key == "a"){
			camera.rotation.y += (delta * Math.PI / 180);
		}
		if(e.key == "d"){
			camera.rotation.y -= (delta * Math.PI / 180);
		}
	 });
	
	 renderer.render(scene, camera);
};


/**
 * Funktion
 * Laden und erstellen der Skybox
 */
function skyboxladen() {
	
	var directions  = ["SBF", "SBB", "SBT", "SBBo", "SBL", "SBR"];

	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
	}));
	 
	var skyGeometry = new THREE.BoxGeometry( 1000, 1000, 1000 );
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	
	return skyBox;
}



render(); 