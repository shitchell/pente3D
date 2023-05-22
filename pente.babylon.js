// This is a 3D implementation of the game Pente. It generates an N x N x N grid
// of spheres using Babylon.js and allows the user to interact with the grid.
//
// Query parameters:
// - debug: If true, print debug messages to the console. Defaults to false.
//
// TODO:
// - Add options to:
//   - Change the size of the grid
//   - Change the number of spheres in a row needed to win
//   - Add grid lines
//   - Change the color of the spheres
// - Network play

var defaultOptions = {
  size: 10, // Number of spheres in each dimension
  winLength: 5, // Number of spheres in a row needed to win
  rowSize: 10, // Number of spheres in a row
  sphereDiameter: 2, // Diameter of each sphere
  sphereSpacing: 8, // Spacing between spheres
  sphereColorPlayer1: new BABYLON.Color3(0, 1, 0.5), // Color of player 1's spheres
  sphereColorPlayer2: new BABYLON.Color3(1, 0, 0), // Color of player 2's spheres
  sphereColorDefault: new BABYLON.Color3(0.7, 0.7, 0.7), // Color of unclaimed spheres
  sphereColorFlagged: new BABYLON.Color3(1, 1, 0), // Color of flagged spheres
  sphereColorRemoved: new BABYLON.Color3(0.5, 0.5, 0.5), // Color of removed spheres
  sphereColorHovered: new BABYLON.Color3(0.8, 0.8, 0.8), // Color of hovered spheres
  backgroundColor: new BABYLON.Color3(0.2, 0.2, 0.3), // Color of the background
  gridColor: new BABYLON.Color3(0.5, 0.5, 0.5), // Color of the grid lines
  gridColorHover: new BABYLON.Color3(0.8, 0.8, 0.8), // Color of the grid lines when hovered over
}

// If true, print debug messages to the console. Default to the value of the
// "debug" query parameter, or false if it's not set.
var DEBUG = (new URLSearchParams(window.location.search)).get("debug") === "true";
function debug(...message) {
  if (DEBUG) {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let prefix = `[pente3D] ${timestamp} --`;
    console.log(prefix, ...message);
  }
}

function createScene(options) {
  // Setup game uptions using the defaults as a base and updating with any
  // options passed in
  options = Object.assign({}, defaultOptions, options);
  debug("Options: ", options);

  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // Set the background color to the default dark blue
  scene.clearColor = options.backgroundColor;

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
  const spaceNumber = options.sphereSpacing;
  const size = options.sphereDiameter;
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

  // Place the origin at the center by creating an offset vector of size/2 and
  // subtracting it from the position of each sphere in all three dimensions
  let offset = (size / 2) * spaceNumber;
  for (var k = 0; k < size; k++) {
    for (var j = 0; j < size; j++) {
      for (var i = 0; i < size; i++) {
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere:" + i + ":" + j + ":" + ":" + k + ":" + 0, { diameter: 2, segments: 32 }, scene);
        sphere.position.y = 1 + (j * spaceNumber) - offset;
        sphere.position.x = i * spaceNumber - offset;
        sphere.position.z = (k * spaceNumber) - offset;

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
    width: 0.5,
    height: 0.5
  }, scene);
  // Set the ground to a semi-transparent black material so that the origin is
  // identifiable but subtle
  var material = new BABYLON.StandardMaterial("scene");
  material.alpha = 0.2;
  material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
  ground.material = material;

  return scene;
}