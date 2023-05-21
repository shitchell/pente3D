var DEBUG = false;
function debug(...message) {
  if (DEBUG) {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let prefix = `[pente3D] ${timestamp} --`;
    debug(prefix, ...message);
  }
}

function createScene() {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);
  // var camera = new BABYLON.FlyCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);


  //  BABYLON.FlyCamera
  // This creates and positions a free camera (non-mesh)
  // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(50, 50, -100), scene);

  // This targets the camera to scene origin
  //  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);

  // camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape. Params: name, options, scene
  var sphereArray = [];
  // Move the sphere upward 1/2 its 
  const spaceNumber = 8;
  const size = 10;
  scene.onPointerObservable.add((pointerInfo) => {

    // debug("Pointer info :"+);
    var badState = 0;
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        debug("POINTER DOWN");
        break;
      case BABYLON.PointerEventTypes.POINTERUP:
        debug("POINTER UP");
        break;
      case BABYLON.PointerEventTypes.POINTERMOVE:
        debug("POINTER MOVE");
        break;
      case BABYLON.PointerEventTypes.POINTERWHEEL:
        debug("POINTER WHEEL");
        break;
      case BABYLON.PointerEventTypes.POINTERPICK:
        debug("POINTER PICK");
        break;
      case BABYLON.PointerEventTypes.POINTERTAP:
        debug("POINTER TAP");
        if (pointerInfo.event.button == 2) {
          camera.focusOn([pointerInfo.pickInfo.pickedMesh], true);
        }
        break;
      case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
        debug("POINTER DOUBLE-TAP: " + badState);

        var oldMeterial = pointerInfo.pickInfo.pickedMesh.material;
        var arrayOfProbs = pointerInfo.pickInfo.pickedMesh.name.split(":");//LOL WTF
        var numberState = Number(arrayOfProbs[4]);
        var material = new BABYLON.StandardMaterial("scene");
        if (numberState == 3) {
          material.alpha = 0.9;
          material.diffuseColor = new BABYLON.Color3(0, 1, 0.5);
          sphere.material = material;
          pointerInfo.pickInfo.pickedMesh.material = material;
        } else if (numberState == 2) {
          material.alpha = 0.9;
          material.diffuseColor = new BABYLON.Color3(1, 0, 0);
          sphere.material = material;
          pointerInfo.pickInfo.pickedMesh.material = material;
        } else if (numberState == 1) {
          material.alpha = 0.6;
          material.diffuseColor = new BABYLON.Color3(1, 1, 0);
          sphere.material = material;
          pointerInfo.pickInfo.pickedMesh.material = material;
        } else {
          material.alpha = 0.35;
          material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
          sphere.material = material;
          pointerInfo.pickInfo.pickedMesh.material = material;
        }
        numberState++;
        if (numberState > 3) {
          numberState = 0;//TODO add back in start color set up
        }
        let nameString = arrayOfProbs[0] + ":" + arrayOfProbs[1] + ":" + arrayOfProbs[2] + ":" + arrayOfProbs[3] + ":" + numberState;
        pointerInfo.pickInfo.pickedMesh.name = nameString;
        break;
    }
  });
  for (var k = 0; k < size; k++) {
    for (var j = 0; j < size; j++) {
      for (var i = 0; i < size; i++) {
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere:" + i + ":" + j + ":" + ":" + k + ":" + 0, { diameter: 2, segments: 32 }, scene);
        sphere.position.y = 1 + (j * spaceNumber);
        sphere.position.x = i * spaceNumber;
        sphere.position.z = (k * spaceNumber);

        if (i % 2 == 0) {
          var material = new BABYLON.StandardMaterial("scene");
          material.alpha = 0.2;
          // material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
          sphere.material = material;
        } else {
          var material = new BABYLON.StandardMaterial("scene");
          material.alpha = 0.35;
          // material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
          sphere.material = material;
        }
        sphereArray[i] = sphere;

      }
    }
  }


  // Our built-in 'ground' shape. Params: name, options, scene
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 2,
    height: 2
  }, scene);

  return scene;
}