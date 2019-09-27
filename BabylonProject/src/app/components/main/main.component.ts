import { Component, OnInit } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Engine, Scene, Vector3, GizmoManager } from 'babylonjs';
// import * as Materials from 'babylonjs-materials';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  canvas: any;
  camera: any;//BABYLON.Camera; 
  light: BABYLON.PointLight;
  ground: BABYLON.Mesh;
  box: BABYLON.Mesh; 
  box2: BABYLON.Mesh; 
  material : BABYLON.StandardMaterial;

  private engine: BABYLON.Engine; // The Babylon.js engine 
  private scene: BABYLON.Scene; // The scene where to add the nodes 
  private gizmoManager: any; //BABYLON.GizmoManager;

  //booleans
  toggleWireframe: boolean = false;
  toggleRotation: boolean = true;
  toggleBkg: boolean = false;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById("canvas");
    this.createScene();
  }

  createScene() {
    // Engine 
    this.engine = new BABYLON.Engine(this.canvas); 
 
    // Create the scene 
    this.scene = new BABYLON.Scene(this.engine); 
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0);  //if clearColor not specified then default background of scene - darkblue
 
    // Camera 
    this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10 , new BABYLON.Vector3(0, 0, 0),  this.scene);   // new BABYLON.Vector3(0,0,0) or BABYLON.Vector3.Zero()
    this.camera.attachControl(this.canvas, true); 
    this.camera.setPosition(new BABYLON.Vector3(20, 200, 400));
    this.camera.lowerBetaLimit = 0.1;
    this.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    this.camera.lowerRadiusLimit = 150;
 
    // Light 
    this.light = new BABYLON.PointLight("light",new BABYLON.Vector3(0 ,50, 0), this.scene); 
    // this.light.diffuse = new BABYLON.Color3(0.7, 0.7, 0);  //green light
    // this.light.specular = new BABYLON.Color3(1, 0, 1); 
    // this.light.intensity = 1.0; 


    // Meshes
    // this.ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, this.scene, false);
    // let groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
    // groundMaterial.specularColor = BABYLON.Color3.Black();
    // this.ground.material = groundMaterial;
 
    this.box = BABYLON.Mesh.CreateBox("box", 20, this.scene); 
    this.material = new BABYLON.StandardMaterial('material', this.scene)
    this.material.emissiveColor = BABYLON.Color3.Green();
    this.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    this.material.specularColor =  new BABYLON.Color3(0.4, 0.4, 0.4);
    this.box.material = this.material;
    this.box.position.z -= 100;
    this.box.position.y = 10;

    this.box2 = BABYLON.Mesh.CreateBox("box2", 20, this.scene); 
    let material:any = new BABYLON.StandardMaterial('material', this.scene)
    material.emissiveColor = BABYLON.Color3.Blue();
    material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    material.specularColor =  new BABYLON.Color3(0.4, 0.4, 0.4);
    this.box2.material = material;
    this.box2.position.x += 100;
    this.box2.position.y = 10;


    this.addGizmoBoundingBox();
    //this.addEventListeners();
    this.runRenderLoop();
  }

  public runRenderLoop(): void { 
    this.engine.runRenderLoop(() => { 
      this.scene.render(); 
    }); 
  }

  addGizmoBoundingBox() {
    // GIZMO
    this.gizmoManager = new BABYLON.GizmoManager(this.scene);
    this.gizmoManager.positionGizmoEnabled = true;
    // this.gizmoManager.rotationGizmoEnabled = true;
    //this.gizmoManager.scaleGizmoEnabled = true;
    this.gizmoManager.boundingBoxGizmoEnabled = true;

    //this.gizmoManager.attachableMeshes = [this.box, this.box2];

    // document.onkeydown = (e)=>{
    //   if(e.key == 'w' || e.key == 'e'|| e.key == 'r'|| e.key == 'q'){
    //       // Switch gizmo type
    //       this.gizmoManager.positionGizmoEnabled = false;
    //       this.gizmoManager.rotationGizmoEnabled = false;
    //       this.gizmoManager.scaleGizmoEnabled = false;
    //       this.gizmoManager.boundingBoxGizmoEnabled = false;
    //       if(e.key == 'w'){
    //         this.gizmoManager.positionGizmoEnabled = true;
    //       }
    //       if(e.key == 'e'){
    //         this.gizmoManager.rotationGizmoEnabled = true;
    //       }
    //       if(e.key == 'r'){
    //         this.gizmoManager.scaleGizmoEnabled = true;
    //       }
    //       if(e.key == 'q'){
    //         this.gizmoManager.boundingBoxGizmoEnabled = true;
    //         this.gizmoManager.rotationGizmoEnabled = true;
    //       }
    //   }
    //   if(e.key == 'y'){
    //       // hide the gizmo
    //       this.gizmoManager.attachToMesh(null);
    //   }
    //   if(e.key == 'a'){
    //       // Toggle local/global gizmo rotation positioning
    //       this.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !this.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh;
    //       this.gizmoManager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = !this.gizmoManager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh;
    //   }
    //   if(e.key == 's'){
    //       // Toggle distance snapping
    //       if(this.gizmoManager.gizmos.scaleGizmo.snapDistance == 0){
    //         this.gizmoManager.gizmos.scaleGizmo.snapDistance = 0.3;
    //         this.gizmoManager.gizmos.rotationGizmo.snapDistance = 0.3;
    //         this.gizmoManager.gizmos.positionGizmo.snapDistance = 0.3;
    //       }else{
    //         this.gizmoManager.gizmos.scaleGizmo.snapDistance = 0;
    //         this.gizmoManager.gizmos.rotationGizmo.snapDistance = 0;
    //         this.gizmoManager.gizmos.positionGizmo.snapDistance = 0;
    //       }
    //   }
    //   if(e.key == 'd'){
    //       // Toggle gizmo size
    //       if(this.gizmoManager.gizmos.scaleGizmo.scaleRatio == 1){
    //         this.gizmoManager.gizmos.scaleGizmo.scaleRatio = 1.5;
    //         this.gizmoManager.gizmos.rotationGizmo.scaleRatio = 1.5;
    //         this.gizmoManager.gizmos.positionGizmo.scaleRatio = 1.5;
    //       }else{
    //         this.gizmoManager.gizmos.scaleGizmo.scaleRatio = 1;
    //         this.gizmoManager.gizmos.rotationGizmo.scaleRatio = 1;
    //         this.gizmoManager.gizmos.positionGizmo.scaleRatio = 1;
    //       }
    //   }
    // }
  }

  addEventListeners() {
    let startingPoint;
    let currentMesh;

    let getGroundPosition = () => {
      // Use a predicate to get position on the ground
      var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh) => { return mesh == this.ground });  // == ground;
      if (pickinfo.hit) {
          return pickinfo.pickedPoint;
      }
      return null;
    }

    let onPointerDown = (evt) => {
      if (evt.button !== 0) { return; }

      // check if we are under a mesh
      let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh) => { return mesh != this.ground; });  // !=ground
      
      if (pickInfo.hit) {
          currentMesh = pickInfo.pickedMesh;
         // this.gizmoManager.attachToMesh(currentMesh)
          startingPoint = getGroundPosition();

          if (startingPoint) { // we need to disconnect camera from canvas
              setTimeout(() => {
                  this.camera.detachControl(this.canvas);
              }, 0);
          }
      }
    }

    let onPointerUp = () => {
      if (startingPoint) {
          this.camera.attachControl(this.canvas, true);
          startingPoint = null;
          return;
      }
    }

    let onPointerMove = (evt) => {
      if (!startingPoint) { return; }

      let current = getGroundPosition();
      if (!current) { return; }

      var diff = current.subtract(startingPoint);
      currentMesh.position.addInPlace(diff);

      startingPoint = current;
    }


    this.canvas.addEventListener("pointerdown", onPointerDown, false);
    this.canvas.addEventListener("pointerup", onPointerUp, false);
    this.canvas.addEventListener("pointermove", onPointerMove, false);

    this.scene.onDispose = () => {
      this.canvas.removeEventListener("pointerdown", onPointerDown);
      this.canvas.removeEventListener("pointerup", onPointerUp);
      this.canvas.removeEventListener("pointermove", onPointerMove);
    }


  }  //end addEventListener()


  toggleWireframeMaterial() {
    this.toggleWireframe = !this.toggleWireframe;
    this.material.wireframe = this.toggleWireframe ? true : false;
  }

  toggleRotationAxis() {
    this.toggleRotation = !this.toggleRotation;
    this.toggleRotation ? this.box.rotation.z = -0.2 : this.box.rotation.z = 0 ;
  }
  
  changeBackground() {
    this.toggleBkg = !this.toggleBkg;
    this.material.emissiveColor = this.toggleBkg ? new BABYLON.Color3(0, 1 , 1) : new BABYLON.Color3(1, 1, 0)
  }

  setSkybox() {
    let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10.0}, this.scene);
    let  skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../../assets/textures/skybox", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }











}
