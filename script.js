import './style.css';
import 'babylonjs';

class VRApp {
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;

  constructor() {
    const appDiv = <HTMLCanvasElement>document.getElementById('renderCanvas');
    this._engine = new BABYLON.Engine(appDiv, true);
    this._scene = new BABYLON.Scene(this._engine);

    let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), this._scene);
    let ground = BABYLON.Mesh.CreateGround("ground", 50, 50, 2, this._scene);

    for (let i = 0; i < 25; i++) {
      let box = BABYLON.Mesh.CreateBox(`box_${i}`, 2, this._scene);
      box.position = new BABYLON.Vector3(Math.random() * 50.0 - 25.0, 1, Math.random() * 50.0 - 25.0);
    }

    var vrHelper = this._scene.createDefaultVRExperience();
    vrHelper.enableTeleportation();
  }

  run() {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }
}

new VRApp().run();