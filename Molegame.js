/**
 * Meine.js ist ein Test für WebGL mit three.js
 */

 var scene = new THREE.Scene();
 var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); 
 var renderer = new THREE.WebGLRenderer();
 var uhr = new THREE.Clock();
 var delta = uhr.getDelta();
 
 var imagePrefix = "bilder/";
 var directions  = ["SBF", "SBB", "SBT", "SBBo", "SBL", "SBR"];
 var imageSuffix = ".jpg";
  
 var materialArray = [];
 for (var i = 0; i < 6; i++)
  materialArray.push( new THREE.MeshBasicMaterial({
   map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
   side: THREE.BackSide
  }));
 
 var skyGeometry = new THREE.BoxGeometry( 1000, 1000, 1000 );
 var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
 var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
 scene.add( skyBox );
 
 skyboxMesh = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000, 1, 1, 1), material);
 
 renderer.setSize(window.innerWidth, window.innerHeight);
 
 document.body.appendChild(renderer.domElement);
 
 var geometry = new THREE.BoxGeometry(1,1,1);
 var material = new THREE.MeshPhongMaterial({color: 0x00aa00, envmap: materialArray});
 var cube = new THREE.Mesh(geometry, material);
 
 var ambientlight = new THREE.AmbientLight(0x888888);
 scene.add(ambientlight);
 
 var directionalLight = new THREE.DirectionalLight(0xffffff);
 directionalLight.position.set(1, 1, 1).normalize();
 scene.add(directionalLight);
 
 scene.add(cube);
 camera.position.z = 5;
 var render = function () { 
	 requestAnimationFrame(render);
	 delta = uhr.getDelta();
	 
	 cube.rotation.x += (delta * Math.PI );
	 cube.rotation.y += (delta * Math.PI );
	 document.addEventListener("keydown", function(e){
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

render(); 