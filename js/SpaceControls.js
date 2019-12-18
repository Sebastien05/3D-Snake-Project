//Velocite de la camera
const VEL = 0.8

var rotation_active = true;
var ongoingTouches = [];
var dernierePositionX = window.width / 2;
var dernierePositionY = window.height / 2;
var boost_value = 1;
var rotationVector = new THREE.Vector3( 0, 0, 0 );

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var jump = false;
var crouch = false;
var rotateLeft = false;
var rotateRight = false;

var InterdictionmoveForward = false;
var InterdictionmoveBackward = false;
var InterdictionmoveLeft = false;
var InterdictionmoveRight = false;
var Interdictionjump = false;
var Interdictioncrouch = false;


function update_character_controls( delta ){

	
	if (acceleratorTrap){
		// arriver à la vitesse max à un tier du temps depuis le debut
		// var coefSmooth = Math.pow(((Date.now() - acceleratorTrapStart)/ACCELERATOR_DURATION),2)
		// var coefSmooth = Math.sqrt(((Date.now() - acceleratorTrapStart)/ACCELERATOR_DURATION))
		// var coefSmooth = Math.pow(((Date.now() - acceleratorTrapStart)/ACCELERATOR_DURATION),1/3)

		// character.velocity.multiplyScalar(VEL+coefSmooth/10);
		character.velocity.multiplyScalar(0.9);

	} 
	else character.velocity.multiplyScalar(VEL);

	var deplacement_normalize = new THREE.Vector3();

	// deplacement_normalize.z -= 1
	if (state == "finish" && moveForward && !InterdictionmoveForward){deplacement_normalize.z -= 1;}
	if (state!= "finish") deplacement_normalize.z -= 1;
	if (state == "finish" && moveBackward && !InterdictionmoveBackward){deplacement_normalize.z += 1;}
	if (moveLeft && !InterdictionmoveLeft){deplacement_normalize.x -= 1;}
	if (moveRight && !InterdictionmoveRight){deplacement_normalize.x += 1;}
	if (jump && (Date.now() - jumpTime < JUMPSTAMINA) && !Interdictionjump){
		deplacement_normalize.y += 1;
		deplacement_normalize.z += 0.3;
		}
	// deplacement_normalize.y -=1
	if (crouch && !Interdictioncrouch){deplacement_normalize.y -= 1;}
	if (rotateLeft){character.rotation.z += 0.03};
	if (rotateRight){character.rotation.z -= 0.03};

	deplacement_normalize.applyQuaternion(character.quaternion);
	deplacement_normalize.normalize();
	deplacement_normalize.multiplyScalar(1);
	character.velocity.add(deplacement_normalize);	
	character.position.add(character.velocity);

}

function SpaceControls( character, vectors ) {	

	var pitchUp = 0;
	var yawLeft = 0;
	var yawRight = 0;
	var pitchDown = 0;
	var vector = new THREE.Vector3(); // create once and reuse it!
	this.object = character;
	character.velocity = new THREE.Vector3(0,0,0);

	//Evènements associés aux déplacements et aux touches (mobile)
	document.getElementById("game_canvas").addEventListener('touchmove', onMouseMove, false );

	var dernierePositionX_unique = 0;
	var dernierePositionY_unique = 0;
	function onTouchMove(event){

		var movementX;
		var movementY;

		if (dernierePositionX_unique > 0){
			var nouvelle_position_x = (event.changedTouches[0].clientX ) || 0;
			movementX = ((nouvelle_position_x - dernierePositionX_unique) * 4) || 0;
			dernierePositionX_unique = nouvelle_position_x;
		}
		else{
			dernierePositionX_unique = (event.changedTouches[0].clientX ) || 0;
		}
		if (dernierePositionY_unique > 0){
			var nouvelle_position_y = (event.changedTouches[0].clientY) || 0;
			movementY = ((nouvelle_position_y - dernierePositionY_unique) * 8) || 0;
			dernierePositionY_unique = nouvelle_position_y;
		}
		else{
			dernierePositionY_unique = (event.changedTouches[0].clientY) || 0;
		}


		yawLeft   = - Math.min(120,Math.max(-120,movementX/2));
		pitchDown =   Math.min(120,Math.max(-120,movementY/2));
		rotationVector.x = ( - pitchDown + pitchUp );
		rotationVector.y = ( - yawRight  + yawLeft );
		character.rotateX(rotationVector.x * 0.002);
		character.rotateY(rotationVector.y * 0.002);
		character.getWorldDirection( vector );
		for (var i = 0; i < vectors.length; i++){
			//devant OK
			if (i == 0){
			vectors[i].x  = vector.x; 
			vectors[i].y  = vector.y; 
			vectors[i].z  = vector.z;
			}
			//derriere OK
			if (i == 1){
			vectors[i].x  = -vector.x; 
			vectors[i].y  = -vector.y; 
			vectors[i].z  = -vector.z;
			}
			//bas
			if (i == 3){
			vectors[i].x  = vector.x; 
			vectors[i].y  = vector.z; 
			vectors[i].z  = -vector.y;
			}
			//haut
			if (i == 4){
			vectors[i].x  = -vector.x; 
			vectors[i].y  = -vector.z; 
			vectors[i].z  = vector.y;
			}
			//droite
			if (i == 5){
			vectors[i].x  = -vector.z; 
			vectors[i].y  = vector.y; 
			vectors[i].z  = vector.x;
			}
			//gauche
			if (i == 6){
			vectors[i].x  = vector.z; 
			vectors[i].y  = -vector.y; 
			vectors[i].z  = -vector.x;
			}
		}
	}

	//Evènements associés aux déplacements et aux clics de la souris (ordinateur)
	document.addEventListener('mousemove', onMouseMove, false );
	document.addEventListener('mousedown', onMouseDown, false );
	document.addEventListener('mouseup', onMouseUp, false );

	function onMouseMove(event) {
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		yawLeft   = - Math.min(120,Math.max(-120,movementX/2));
		pitchDown =   Math.min(120,Math.max(-120,movementY/2));
		rotationVector.x = ( - pitchDown + pitchUp );
		rotationVector.y = ( - yawRight  + yawLeft );
		character.rotateX(rotationVector.x * 0.002);
		character.rotateY(rotationVector.y * 0.002);
		character.getWorldDirection( vector );
		for (var i = 0; i < vectors.length; i++){
			//devant OK
			if (i == 0){
			vectors[i].x  = vector.x; 
			vectors[i].y  = vector.y; 
			vectors[i].z  = vector.z;
			}
			//derriere OK
			if (i == 1){
			vectors[i].x  = -vector.x; 
			vectors[i].y  = -vector.y; 
			vectors[i].z  = -vector.z;
			}
			//bas
			if (i == 3){
			vectors[i].x  = vector.x; 
			vectors[i].y  = vector.z; 
			vectors[i].z  = -vector.y;
			}
			//haut
			if (i == 4){
			vectors[i].x  = -vector.x; 
			vectors[i].y  = -vector.z; 
			vectors[i].z  = vector.y;
			}
			//droite
			if (i == 5){
			vectors[i].x  = -vector.z; 
			vectors[i].y  = vector.y; 
			vectors[i].z  = vector.x;
			}
			//gauche
			if (i == 6){
			vectors[i].x  = vector.z; 
			vectors[i].y  = -vector.y; 
			vectors[i].z  = -vector.x;
			}
		}		
	}

	function onMouseDown(evt) {
		var rightclick = false;
		if (evt.which) rightclick = (evt.which == 3);
		else if (evt.button) rightclick = (evt.button == 2);
		if (rightclick){clic_droit();}
		else{clic_gauche();}
	}
	function onMouseUp(evt) {
		//console.log("fin du clic");
	}

	//Evènements associés aux touches du clavier
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	function onKeyDown(evt) {

	switch (evt.keyCode) {
	//A
	case 65:
	rotateLeft = true;
	break;
	//E
	case 69:
	rotateRight = true;
	break;
	//Z
	case 90:
	moveForward = true;
	break;
	//Q
	case 81:
	moveLeft = true;
	break;
	//S
	case 83:
	moveBackward = true;
	break;
	//D
	case 68:
	moveRight = true;
	break;
	//ESPACE
	case 32:
		if (jumpState == false) {
			console.log("JUMP NOW")
			jumpState = true;
			jumpTime = Date.now();
		}	
		jump = true;
	break;
	//CONTROL
	case 17:
	crouch = true;
	break;
	//1
	case 49: {}
	break;
	//2
	case 50: {}
	break;
	//3
	case 51: {}
	break;
	//4
	case 52: {}
	break;
	//5
	case 53: {}
	break;
	//6
	case 54: {}
	break;
	//7
	case 55: {}
	break;
	//8
	case 56: {}
	break;
	//9
	case 57: {}
	break;
	//0
	case 58: {}
	break;
	}
	};
	function onKeyUp(evt) {
	switch (evt.keyCode) {
	case 65:
	rotateLeft = false;
	break;
	case 69:
	rotateRight = false;
	break;
	case 90: // w
	moveForward = false;
	break;
	case 81: // a
	moveLeft = false;
	break;
	case 83: // s
	moveBackward = false;
	break;
	case 68: // d
	moveRight = false;
	case 32:
		jumpState = false;
		jump = false
		console.log("STOP JUMPING");
		break;
	break;
	case 17:
	crouch = false;
	break;
	}
	};
};








function pointerlockConfiguration(){
  document.pointerLockElement = document.pointerLockElement    ||
                                document.mozPointerLockElement ||
                                document.webkitPointerLockElement;
  document.getElementById("game_canvas").requestPointerLock = document.getElementById("game_canvas").requestPointerLock ||
                                                          document.getElementById("game_canvas").mozRequestPointerLock;
  document.exitPointerLock =  document.exitPointerLock ||
                              document.mozExitPointerLock||
                              document.webkitExitPointerLock;
  document.getElementById("game_canvas").onclick = function() {
    document.getElementById("game_canvas").requestPointerLock();
  };
  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  function lockChangeAlert() {
    if (document.pointerLockElement === document.getElementById("game_canvas") ||
        document.mozPointerLockElement === document.getElementById("game_canvas")) {
      document.getElementById("options_div").style.display = "none";
    }
    else{
      document.getElementById("options_div").style.display = "";
    }
  }
}




